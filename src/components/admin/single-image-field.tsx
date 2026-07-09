"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { UploadCloud, Loader2, Trash2 } from "lucide-react"
import { uploadProductImage } from "@/app/actions/upload"
import { useToast } from "@/hooks/use-toast"

interface Props {
    label: string
    value: string
    onChange: (url: string) => void
    nameHint?: string
}

export function SingleImageField({ label, value, onChange, nameHint }: Props) {
    const { toast } = useToast()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [uploading, setUploading] = useState(false)

    const handleFile = async (file: File) => {
        if (!file.type.startsWith("image/")) return
        setUploading(true)
        const fd = new FormData()
        fd.append("file", file)
        if (nameHint) fd.append("nameHint", nameHint)
        const res = await uploadProductImage(fd)
        setUploading(false)
        if (res.success && res.url) {
            onChange(res.url)
            toast({ title: "آپلود شد", description: "تصویر بهینه و ذخیره شد." })
        } else {
            toast({ title: "خطا در آپلود", description: res.error, variant: "destructive" })
        }
    }

    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">{label}</p>

            {value ? (
                <div className="group relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-border bg-white">
                    <Image src={value} alt={label} fill className="object-cover" unoptimized sizes="240px" />
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-lg p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity"
                        title="حذف تصویر"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => !uploading && inputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border hover:border-muted-foreground/40 hover:bg-accent/40 aspect-[4/3] w-full cursor-pointer transition-all text-center px-3"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                            <p className="text-xs font-bold text-foreground">در حال آپلود...</p>
                        </>
                    ) : (
                        <>
                            <div className="p-2.5 rounded-xl bg-muted">
                                <UploadCloud className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <p className="text-xs font-bold text-foreground">آپلود تصویر</p>
                            <p className="text-[10px] text-muted-foreground">به WebP بهینه می‌شود</p>
                        </>
                    )}
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    if (e.target.files?.[0]) handleFile(e.target.files[0])
                    e.target.value = ""
                }}
            />
        </div>
    )
}
