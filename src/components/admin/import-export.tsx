"use client"

import { useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { exportProductsCsv, importProductsCsv } from "@/app/actions/import-export"
import {
    Download,
    Upload,
    Loader2,
    FileSpreadsheet,
    CheckCircle2,
    AlertTriangle,
    UploadCloud,
    Info,
    FileDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

const COLUMNS = [
    { name: "عنوان", req: true, ex: "کنتاکتور Schneider 32A" },
    { name: "کد فنی", req: true, ex: "1000032" },
    { name: "برند", req: false, ex: "Schneider" },
    { name: "دسته‌بندی", req: false, ex: "کنتاکتور" },
    { name: "وضعیت موجودی", req: false, ex: "موجود / تماس بگیرید / ناموجود" },
    { name: "تعداد موجودی", req: false, ex: "11" },
    { name: "مشخصات فنی", req: false, ex: "جریان=32A | ولتاژ=220V" },
    { name: "ویژگی‌های کلیدی", req: false, ex: "نصب روی ریل | کنتاکت نقره‌ای" },
]

export function ImportExport() {
    const router = useRouter()
    const { toast } = useToast()
    const fileRef = useRef<HTMLInputElement | null>(null)

    const [exporting, setExporting] = useState(false)
    const [importing, setImporting] = useState(false)
    const [dragOver, setDragOver] = useState(false)

    const [importOpen, setImportOpen] = useState(false)
    const [report, setReport] = useState<{
        created: number
        updated: number
        skipped: number
        errors: string[]
    } | null>(null)

    const handleExport = async () => {
        setExporting(true)
        try {
            const { filename, content } = await exportProductsCsv()
            downloadCsv(filename, content)
            toast({ title: "خروجی گرفته شد", description: "فایل CSV دانلود شد." })
        } catch (e: any) {
            toast({ title: "خطا", description: e?.message ?? "خطا در خروجی", variant: "destructive" })
        } finally {
            setExporting(false)
        }
    }

    const downloadCsv = (filename: string, content: string) => {
        const blob = new Blob([content], { type: "text/csv;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
    }

    const downloadTemplate = () => {
        const headers = COLUMNS.map((c) => c.name)
        const sample = [
            "کنتاکتور نمونه Schneider 25A",
            "SAMPLE-25",
            "Schneider",
            "کنتاکتور",
            "موجود",
            "5",
            "جریان=25A | ولتاژ=220V",
            "نصب روی ریل | کنتاکت نقره‌ای",
        ]
        const csv = "﻿" + headers.join(",") + "\r\n" + sample.map((c) => `"${c}"`).join(",")
        downloadCsv("stockcity-template.csv", csv)
    }

    const handleImport = useCallback(
        async (file: File) => {
            setImporting(true)
            setReport(null)
            try {
                const text = await file.text()
                const res = await importProductsCsv(text)
                if (res.success) {
                    setReport({
                        created: res.created ?? 0,
                        updated: res.updated ?? 0,
                        skipped: res.skipped ?? 0,
                        errors: res.errors ?? [],
                    })
                    router.refresh()
                } else {
                    toast({ title: "خطا", description: res.error, variant: "destructive" })
                }
            } catch (e: any) {
                toast({ title: "خطا", description: e?.message ?? "خطا در خواندن فایل", variant: "destructive" })
            } finally {
                setImporting(false)
            }
        },
        [router, toast],
    )

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setDragOver(false)
            const f = e.dataTransfer.files?.[0]
            if (f) handleImport(f)
        },
        [handleImport],
    )

    return (
        <>
            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleExport} disabled={exporting} className="gap-2 h-9 text-xs">
                    {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                    خروجی Excel
                </Button>
                <Button
                    variant="outline"
                    onClick={() => {
                        setReport(null)
                        setImportOpen(true)
                    }}
                    className="gap-2 h-9 text-xs"
                >
                    <Upload className="w-3.5 h-3.5" />
                    ورود از Excel
                </Button>
            </div>

            <Dialog open={importOpen} onOpenChange={setImportOpen}>
                <DialogContent dir="rtl" className="max-w-2xl">
                    <DialogHeader className="text-right">
                        <DialogTitle className="flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            ورود گروهی محصولات از Excel
                        </DialogTitle>
                        <DialogDescription>
                            فایل CSV خود را طبق فرمت زیر آماده کنید. محصولاتی که «کد فنی» تکراری دارند به‌روزرسانی می‌شوند.
                        </DialogDescription>
                    </DialogHeader>

                    {!report ? (
                        <div className="space-y-4">
                            
                            <div className="rounded-xl border border-border overflow-hidden">
                                <div className="flex items-center gap-2 bg-muted/50 px-4 py-2.5 text-xs font-bold text-foreground">
                                    <Info className="w-4 h-4 text-primary" /> ستون‌های فایل (به همین ترتیب)
                                </div>
                                <div className="max-h-52 overflow-y-auto divide-y divide-border">
                                    {COLUMNS.map((col) => (
                                        <div key={col.name} className="flex items-center gap-3 px-4 py-2 text-xs">
                                            <span className="font-bold text-foreground min-w-[110px]">{col.name}</span>
                                            {col.req ? (
                                                <span className="text-[10px] text-red-600 dark:text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">الزامی</span>
                                            ) : (
                                                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">اختیاری</span>
                                            )}
                                            <span className="text-muted-foreground truncate" dir="auto">{col.ex}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-blue-500/5 border border-blue-500/15 rounded-lg p-2.5 leading-5">
                                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                <span>
                                    نکته: «مشخصات فنی» را به‌صورت <code className="bg-muted px-1 rounded">کلید=مقدار</code> و با
                                    جداکننده‌ی <code className="bg-muted px-1 rounded">|</code> بنویسید. «ویژگی‌های کلیدی» هم با
                                    <code className="bg-muted px-1 rounded mx-1">|</code> از هم جدا می‌شوند.
                                </span>
                            </div>

                            <Button variant="ghost" size="sm" onClick={downloadTemplate} className="gap-2 text-xs text-primary">
                                <FileDown className="w-4 h-4" /> دانلود فایل نمونه (Template)
                            </Button>

                            
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault()
                                    setDragOver(true)
                                }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={onDrop}
                                onClick={() => !importing && fileRef.current?.click()}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-10 text-center cursor-pointer transition-all",
                                    dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-accent/40",
                                    importing && "pointer-events-none opacity-70",
                                )}
                            >
                                {importing ? (
                                    <>
                                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                        <p className="text-sm font-bold text-foreground">در حال پردازش فایل...</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-3 rounded-2xl bg-muted">
                                            <UploadCloud className="w-7 h-7 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm font-bold text-foreground">فایل CSV را اینجا رها کنید یا کلیک کنید</p>
                                        <p className="text-[11px] text-muted-foreground">فقط فایل با پسوند .csv</p>
                                    </>
                                )}
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".csv,text/csv"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0]
                                        if (f) handleImport(f)
                                        e.target.value = ""
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{report.created}</p>
                                    <p className="text-[11px] text-muted-foreground mt-1">جدید</p>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{report.updated}</p>
                                    <p className="text-[11px] text-muted-foreground mt-1">به‌روزرسانی</p>
                                </div>
                                <div className="bg-muted border border-border rounded-xl p-3 text-center">
                                    <p className="text-2xl font-black text-muted-foreground">{report.skipped}</p>
                                    <p className="text-[11px] text-muted-foreground mt-1">رد شده</p>
                                </div>
                            </div>

                            {report.errors.length === 0 ? (
                                <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 rounded-lg p-3">
                                    <CheckCircle2 className="w-4 h-4" /> همه‌ی سطرها با موفقیت پردازش شدند.
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                                        <AlertTriangle className="w-4 h-4" /> {report.errors.length} هشدار:
                                    </p>
                                    <div className="max-h-40 overflow-y-auto text-[11px] text-muted-foreground bg-muted rounded-lg p-3 space-y-1">
                                        {report.errors.map((err, i) => (
                                            <p key={i}>• {err}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setReport(null)} className="flex-1">
                                    ورود فایل دیگر
                                </Button>
                                <Button onClick={() => setImportOpen(false)} className="flex-1">بستن</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
