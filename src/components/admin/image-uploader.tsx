"use client"

import { useCallback, useRef, useState } from "react"
import Image from "next/image"
import {
    UploadCloud,
    Loader2,
    Trash2,
    Star,
    ArrowRight,
    ArrowLeft,
    ImageIcon,
} from "lucide-react"
import { uploadProductImage } from "@/app/actions/upload"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Props {
    value: string[]
    onChange: (images: string[]) => void
    /** متن برای نام‌گذاری فایل‌ها (مثل کد فنی یا عنوان محصول) */
    nameHint?: string
}

export function ImageUploader({ value, onChange, nameHint }: Props) {
    const { toast } = useToast()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState({ done: 0, total: 0 })
    const [dragOver, setDragOver] = useState(false)

    const handleFiles = useCallback(
        async (files: FileList | File[]) => {
            const list = Array.from(files).filter((f) => f.type.startsWith("image/"))
            if (list.length === 0) return

            setUploading(true)
            setProgress({ done: 0, total: list.length })

            const uploaded: string[] = []
            for (let i = 0; i < list.length; i++) {
                const fd = new FormData()
                fd.append("file", list[i])
                if (nameHint) fd.append("nameHint", nameHint)
                const res = await uploadProductImage(fd)
                if (res.success && res.url) {
                    uploaded.push(res.url)
                } else {
                    toast({
                        title: "خطا در آپلود",
                        description: res.error ?? list[i].name,
                        variant: "destructive",
                    })
                }
                setProgress({ done: i + 1, total: list.length })
            }

            if (uploaded.length) {
                onChange([...value, ...uploaded])
                toast({ title: "آپلود شد", description: `${uploaded.length} تصویر بهینه و افزوده شد.` })
            }
            setUploading(false)
            setProgress({ done: 0, total: 0 })
        },
        [value, onChange, toast, nameHint],
    )

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setDragOver(false)
            if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
        },
        [handleFiles],
    )

    const removeAt = (i: number) => onChange(value.filter((_, idx) => idx !== i))

    const move = (i: number, dir: -1 | 1) => {
        const j = i + dir
        if (j < 0 || j >= value.length) return
        const next = [...value]
        ;[next[i], next[j]] = [next[j], next[i]]
        onChange(next)
    }

    const makeCover = (i: number) => {
        if (i === 0) return
        const next = [...value]
        const [item] = next.splice(i, 1)
        next.unshift(item)
        onChange(next)
    }

    return (
        <div className="space-y-4">
            {/* محل کشیدن و رها کردن */}
            <div
                onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => !uploading && inputRef.current?.click()}
                className={cn(
                    "relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-all",
                    dragOver
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/40 hover:bg-accent/40",
                    uploading && "pointer-events-none opacity-80",
                )}
            >
                {uploading ? (
                    <>
                        <Loader2 className="w-7 h-7 text-primary animate-spin" />
                        <p className="text-sm font-bold text-foreground">
                            در حال بهینه‌سازی و آپلود... ({progress.done}/{progress.total})
                        </p>
                        <div className="w-40 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="p-3 rounded-2xl bg-muted">
                            <UploadCloud className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-bold text-foreground">تصاویر را اینجا رها کنید یا کلیک کنید</p>
                        <p className="text-[11px] text-muted-foreground">
                            خودکار به WebP بهینه و فشرده می‌شود — JPG/PNG/WebP تا ۱۵ مگابایت
                        </p>
                    </>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files?.length) handleFiles(e.target.files)
                        e.target.value = ""
                    }}
                />
            </div>

            {/* پیش‌نمایش تصاویر */}
            {value.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                    {value.map((img, i) => (
                        <div
                            key={img + i}
                            className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-white"
                        >
                            <Image src={img} alt="" fill className="object-contain p-2" unoptimized sizes="120px" />

                            {i === 0 && (
                                <span className="absolute bottom-1 right-1 z-10 flex items-center gap-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                    <Star className="w-2.5 h-2.5 fill-white" /> کاور
                                </span>
                            )}

                            <div className="absolute inset-0 flex flex-col justify-between p-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-black/50 via-transparent to-black/50">
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => removeAt(i)}
                                        className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-1.5 shadow"
                                        title="حذف"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    {i !== 0 && (
                                        <button
                                            type="button"
                                            onClick={() => makeCover(i)}
                                            className="bg-white/90 hover:bg-white text-emerald-700 rounded-lg p-1.5 shadow"
                                            title="انتخاب به‌عنوان کاور"
                                        >
                                            <Star className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => move(i, -1)}
                                        disabled={i === 0}
                                        className="bg-white/90 hover:bg-white text-slate-700 rounded-lg p-1.5 shadow disabled:opacity-30"
                                        title="جابه‌جایی به راست"
                                    >
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => move(i, 1)}
                                        disabled={i === value.length - 1}
                                        className="bg-white/90 hover:bg-white text-slate-700 rounded-lg p-1.5 shadow disabled:opacity-30"
                                        title="جابه‌جایی به چپ"
                                    >
                                        <ArrowLeft className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-2">
                    <ImageIcon className="w-4 h-4" />
                    هنوز تصویری اضافه نشده است
                </div>
            )}
        </div>
    )
}
