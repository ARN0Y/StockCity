"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { addCategory, editCategory, removeCategory } from "@/app/actions/categories"
import { Plus, Pencil, Trash2, Loader2, FolderTree, Package, Hash } from "lucide-react"

interface CategoryRow {
    id: string
    name: string
    slug: string
    product_count: number
}

interface Props {
    categories: CategoryRow[]
}

export function CategoryManager({ categories }: Props) {
    const router = useRouter()
    const { toast } = useToast()

    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState<CategoryRow | null>(null)
    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const openNew = () => {
        setEditing(null)
        setName("")
        setSlug("")
        setOpen(true)
    }

    const openEdit = (c: CategoryRow) => {
        setEditing(c)
        setName(c.name)
        setSlug(c.slug)
        setOpen(true)
    }

    const save = async () => {
        if (!name.trim()) {
            toast({ title: "نام دسته الزامی است", variant: "destructive" })
            return
        }
        setSaving(true)
        const res = editing
            ? await editCategory(editing.id, { name, slug })
            : await addCategory({ name, slug })
        setSaving(false)

        if (res.success) {
            toast({ title: editing ? "دسته ویرایش شد" : "دسته اضافه شد" })
            setOpen(false)
            router.refresh()
        } else {
            toast({ title: "خطا", description: res.error, variant: "destructive" })
        }
    }

    const del = async (c: CategoryRow) => {
        if (!confirm(`دسته «${c.name}» حذف شود؟ محصولات این دسته حذف نمی‌شوند، فقط بدون دسته می‌مانند.`)) return
        setDeletingId(c.id)
        const res = await removeCategory(c.id)
        setDeletingId(null)
        if (res.success) {
            toast({ title: "دسته حذف شد" })
            router.refresh()
        } else {
            toast({ title: "خطا", description: res.error, variant: "destructive" })
        }
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
                        <FolderTree className="w-6 h-6 text-primary" /> دسته‌بندی‌ها
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">مدیریت دسته‌بندی محصولات فروشگاه</p>
                </div>
                <Button onClick={openNew} className="gap-2 font-bold">
                    <Plus className="w-4 h-4" /> دسته جدید
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {categories.map((c) => (
                    <div
                        key={c.id}
                        className="group bg-card rounded-2xl border border-border p-5 hover:shadow-md hover:border-muted-foreground/30 transition-all"
                    >
                        <div className="flex items-start justify-between">
                            <div className="space-y-1.5">
                                <h3 className="font-bold text-foreground">{c.name}</h3>
                                <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                                    <Hash className="w-3 h-3" />
                                    {c.slug}
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openEdit(c)}
                                    className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
                                    title="ویرایش"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => del(c)}
                                    disabled={deletingId === c.id}
                                    className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                    title="حذف"
                                >
                                    {deletingId === c.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted border border-border rounded-lg px-2.5 py-1">
                            <Package className="w-3.5 h-3.5" />
                            {c.product_count} محصول
                        </div>
                    </div>
                ))}

                {categories.length === 0 && (
                    <div className="col-span-full text-center text-sm text-muted-foreground border-2 border-dashed border-border rounded-2xl py-12">
                        هنوز دسته‌ای ثبت نشده است
                    </div>
                )}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent dir="rtl">
                    <DialogHeader className="text-right">
                        <DialogTitle>{editing ? "ویرایش دسته" : "دسته جدید"}</DialogTitle>
                        <DialogDescription>
                            نام فارسی برای نمایش و یک نامک انگلیسی (اختیاری) برای آدرس صفحه.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>نام دسته</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="مثال: کلید مینیاتوری"
                                onKeyDown={(e) => e.key === "Enter" && save()}
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>
                                نامک / Slug <span className="text-muted-foreground font-normal">(اختیاری)</span>
                            </Label>
                            <Input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="miniature"
                                dir="ltr"
                                className="text-left font-mono"
                            />
                            <p className="text-[11px] text-muted-foreground">
                                اگر خالی بماند، خودکار ساخته می‌شود. در آدرس استفاده می‌شود: /category/<b>{slug || "..."}</b>
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
                            انصراف
                        </Button>
                        <Button onClick={save} disabled={saving} className="gap-2 font-bold">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {editing ? "ذخیره تغییرات" : "افزودن دسته"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
