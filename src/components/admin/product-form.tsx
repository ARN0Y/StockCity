"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveProduct } from "@/app/actions/products"
import { removeProductImage } from "@/app/actions/upload"
import { quickAddBrand, addCategory } from "@/app/actions/categories"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { KeyFeaturesInput } from "@/components/admin/key-features-input"
import { ImageUploader } from "@/components/admin/image-uploader"
import { StockStatusPicker, type StockStatus } from "@/components/admin/stock-status-picker"
import {
    Loader2, Plus, Trash2, Save, Image as ImageIcon, Settings2,
    FileText, Tag, GripVertical, Box, ArrowRight, Check, X, FolderPlus,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Option { id: string; name: string }

interface Props {
    initialData?: any
    brands: Option[]
    categories: Option[]
}

type Spec = { key: string; value: string }

export function ProductForm({ initialData, brands: initialBrands, categories: initialCategories }: Props) {
    const router = useRouter()
    const { toast } = useToast()
    const isEdit = !!initialData?.id

    const [brands, setBrands] = useState<Option[]>(initialBrands)
    const categories = initialCategories

    const [saving, setSaving] = useState(false)

    const [title, setTitle] = useState(initialData?.title || "")
    const [modelNumber, setModelNumber] = useState(initialData?.model_number || "")
    const [brandId, setBrandId] = useState(initialData?.brand_id || "")
    const [categoryId, setCategoryId] = useState(initialData?.category_id || "")
    const [stockStatus, setStockStatus] = useState<StockStatus>(initialData?.stock_status || "in_stock")
    const [stockQuantity, setStockQuantity] = useState<string>(
        initialData?.stock_quantity != null ? String(initialData.stock_quantity) : "",
    )
    const [description, setDescription] = useState(initialData?.description || "")
    const [images, setImages] = useState<string[]>(initialData?.images || [])
    const [keyFeatures, setKeyFeatures] = useState<string[]>(initialData?.key_features || [])
    const [specs, setSpecs] = useState<Spec[]>(
        initialData?.specifications && Object.keys(initialData.specifications).length
            ? Object.entries(initialData.specifications).map(([key, value]) => ({ key, value: String(value) }))
            : [{ key: "", value: "" }],
    )
    const initialImages = (initialData?.images || []) as string[]

    // افزودن سریع برند
    const [brandAdding, setBrandAdding] = useState(false)
    const [newBrand, setNewBrand] = useState("")
    const [brandLoading, setBrandLoading] = useState(false)

    // افزودن سریع دسته
    const [catAdding, setCatAdding] = useState(false)
    const [newCat, setNewCat] = useState("")
    const [catLoading, setCatLoading] = useState(false)

    const updateSpec = (i: number, field: keyof Spec, val: string) => {
        const next = [...specs]
        next[i][field] = val
        setSpecs(next)
    }

    const handleAddBrand = async () => {
        if (!newBrand.trim()) return
        setBrandLoading(true)
        const res = await quickAddBrand(newBrand.trim())
        setBrandLoading(false)
        if (res.success && res.id) {
            const exists = brands.find((b) => b.id === res.id)
            if (!exists) setBrands((prev) => [...prev, { id: res.id!, name: res.name! }].sort((a, b) => a.name.localeCompare(b.name)))
            setBrandId(res.id)
            setNewBrand("")
            setBrandAdding(false)
            toast({ title: "برند افزوده شد", description: res.name })
        } else {
            toast({ title: "خطا", description: res.error, variant: "destructive" })
        }
    }

    const handleAddCategory = async () => {
        if (!newCat.trim()) return
        setCatLoading(true)
        const res = await addCategory({ name: newCat.trim() })
        setCatLoading(false)
        if (res.success) {
            toast({ title: "دسته افزوده شد", description: "لیست به‌روزرسانی شد." })
            setNewCat("")
            setCatAdding(false)
            router.refresh() // برای گرفتن id دسته‌ی جدید از سرور
        } else {
            toast({ title: "خطا", description: res.error, variant: "destructive" })
        }
    }

    const handleSubmit = async () => {
        if (!title.trim() || !modelNumber.trim()) {
            toast({ title: "اطلاعات ناقص", description: "عنوان و کد فنی الزامی هستند.", variant: "destructive" })
            return
        }
        if (!categoryId) {
            toast({ title: "دسته‌بندی را انتخاب کنید", description: "هر محصول باید یک دسته‌بندی داشته باشد.", variant: "destructive" })
            return
        }
        setSaving(true)

        // پاک‌سازی فایل تصاویری که حذف شده‌اند
        const removed = initialImages.filter((url) => !images.includes(url))
        if (removed.length) {
            await Promise.allSettled(removed.map((url) => removeProductImage(url)))
        }

        const specsObj = specs.reduce(
            (a, s) => (s.key.trim() ? { ...a, [s.key.trim()]: s.value.trim() } : a),
            {} as Record<string, string>,
        )

        const result = await saveProduct(
            {
                title: title.trim(),
                model_number: modelNumber.trim(),
                brand_id: brandId || null,
                category_id: categoryId || null,
                stock_status: stockStatus,
                stock_quantity:
                    stockStatus === "in_stock" && stockQuantity.trim() !== ""
                        ? Math.max(0, parseInt(stockQuantity, 10) || 0)
                        : null,
                description,
                specifications: specsObj,
                key_features: keyFeatures,
                images,
            },
            initialData?.id,
        )

        setSaving(false)

        if (result.success) {
            toast({ title: "ذخیره شد", description: "عملیات با موفقیت انجام شد." })
            setTimeout(() => {
                router.push("/admin/products")
                router.refresh()
            }, 500)
        } else {
            toast({ title: "خطا", description: result.error, variant: "destructive" })
        }
    }

    return (
        <div className="space-y-6">
            {/* هدر صفحه */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <button
                        onClick={() => router.push("/admin/products")}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-1.5"
                    >
                        <ArrowRight className="w-3.5 h-3.5" /> بازگشت به محصولات
                    </button>
                    <h1 className="text-2xl font-black text-foreground">
                        {isEdit ? "ویرایش محصول" : "افزودن محصول جدید"}
                    </h1>
                </div>
                <Button onClick={handleSubmit} disabled={saving} className="gap-2 font-bold h-11 px-6 shadow-sm">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isEdit ? "ذخیره تغییرات" : "انتشار محصول"}
                </Button>
            </div>

            <div className="grid grid-cols-12 gap-6 items-start">
                {/* ستون اصلی */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <Card className="border-border shadow-none">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                                <Box className="w-4 h-4 text-muted-foreground" /> اطلاعات پایه
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label>عنوان محصول <span className="text-red-500">*</span></Label>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: کنتاکتور Schneider 32A" className="h-12 text-base" />
                            </div>
                            <div className="space-y-2">
                                <Label>کد فنی / کد کالا <span className="text-red-500">*</span></Label>
                                <Input value={modelNumber} onChange={(e) => setModelNumber(e.target.value)} className="h-11 font-mono text-left" dir="ltr" placeholder="1000032" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* مشخصات فنی */}
                    <Card className="border-border shadow-none">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                                <Settings2 className="w-4 h-4 text-muted-foreground" /> مشخصات فنی
                            </CardTitle>
                            <Button onClick={() => setSpecs([...specs, { key: "", value: "" }])} size="sm" variant="outline" className="h-8 text-xs gap-1">
                                <Plus className="w-3.5 h-3.5" /> سطر
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-2.5">
                            {specs.map((spec, i) => (
                                <div key={i} className="flex gap-2 items-center group">
                                    <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                                    <Input placeholder="ویژگی (مثلاً جریان نامی)" value={spec.key} onChange={(e) => updateSpec(i, "key", e.target.value)} className="h-10 text-sm" />
                                    <Input placeholder="مقدار (مثلاً 32A)" value={spec.value} onChange={(e) => updateSpec(i, "value", e.target.value)} className="h-10 text-sm text-left" dir="ltr" />
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground/50 hover:text-destructive shrink-0" onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* ویژگی‌های کلیدی */}
                    <Card className="border-border shadow-none">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                                <Check className="w-4 h-4 text-muted-foreground" /> ویژگی‌های کلیدی
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <KeyFeaturesInput value={keyFeatures} onChange={setKeyFeatures} />
                        </CardContent>
                    </Card>
                </div>

                {/* ستون کناری */}
                <div className="col-span-12 lg:col-span-4 space-y-6 lg:sticky lg:top-6">
                    {/* وضعیت و انتشار */}
                    <Card className="border-border shadow-none">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                                <Tag className="w-4 h-4 text-muted-foreground" /> وضعیت و انتشار
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2.5">
                                <Label className="text-xs text-muted-foreground">وضعیت موجودی</Label>
                                <StockStatusPicker value={stockStatus} onChange={setStockStatus} />
                            </div>

                            {stockStatus === "in_stock" && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                                    <Label className="text-xs text-muted-foreground">تعداد موجودی (اختیاری)</Label>
                                    <Input
                                        value={stockQuantity}
                                        onChange={(e) => setStockQuantity(e.target.value.replace(/[^0-9]/g, ""))}
                                        className="h-11 text-center"
                                        placeholder="مثلاً ۱۱"
                                        inputMode="numeric"
                                    />
                                </div>
                            )}

                            {/* دسته‌بندی */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-muted-foreground">دسته‌بندی <span className="text-red-500">*</span></Label>
                                    <button onClick={() => setCatAdding((v) => !v)} className="text-[11px] text-primary font-bold flex items-center gap-1 hover:underline">
                                        <FolderPlus className="w-3.5 h-3.5" /> دسته جدید
                                    </button>
                                </div>
                                {catAdding ? (
                                    <div className="flex gap-2">
                                        <Input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="نام دسته جدید" className="h-10 text-sm" onKeyDown={(e) => e.key === "Enter" && handleAddCategory()} autoFocus />
                                        <Button size="icon" className="h-10 w-10 shrink-0" onClick={handleAddCategory} disabled={catLoading}>
                                            {catLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-10 w-10 shrink-0" onClick={() => setCatAdding(false)}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Select value={categoryId} onValueChange={setCategoryId}>
                                        <SelectTrigger className="w-full h-11"><SelectValue placeholder="انتخاب دسته..." /></SelectTrigger>
                                        <SelectContent>
                                            {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>

                            {/* برند */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-muted-foreground">برند</Label>
                                    <button onClick={() => setBrandAdding((v) => !v)} className="text-[11px] text-primary font-bold flex items-center gap-1 hover:underline">
                                        <Plus className="w-3.5 h-3.5" /> برند جدید
                                    </button>
                                </div>
                                {brandAdding ? (
                                    <div className="flex gap-2">
                                        <Input value={newBrand} onChange={(e) => setNewBrand(e.target.value)} placeholder="نام برند جدید" className="h-10 text-sm" dir="ltr" onKeyDown={(e) => e.key === "Enter" && handleAddBrand()} autoFocus />
                                        <Button size="icon" className="h-10 w-10 shrink-0" onClick={handleAddBrand} disabled={brandLoading}>
                                            {brandLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-10 w-10 shrink-0" onClick={() => setBrandAdding(false)}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Select value={brandId} onValueChange={setBrandId}>
                                        <SelectTrigger className="w-full h-11"><SelectValue placeholder="انتخاب برند..." /></SelectTrigger>
                                        <SelectContent className="max-h-72">
                                            {brands.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* تصاویر */}
                    <Card className="border-border shadow-none">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-muted-foreground" /> تصاویر محصول
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ImageUploader value={images} onChange={setImages} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* توضیحات و نقد و بررسی — تمام‌عرض برای فضای بیشتر تولید محتوا */}
            <Card className="border-border shadow-none overflow-hidden">
                <CardHeader className="pb-3 border-b border-border bg-muted/30">
                    <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" /> توضیحات و نقد و بررسی محصول
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <RichTextEditor value={description} onChange={setDescription} />
                </CardContent>
            </Card>
        </div>
    )
}
