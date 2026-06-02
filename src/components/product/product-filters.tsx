"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, X, ArrowDownWideNarrow } from "lucide-react"

interface Option {
    slug: string
    name: string
}

interface Props {
    brands: Option[]
    categories: Option[]
}

const STOCK_OPTIONS = [
    { value: "in_stock", label: "موجود" },
    { value: "call_for_price", label: "تماس بگیرید" },
    { value: "out_of_stock", label: "ناموجود" },
]

const SORT_OPTIONS = [
    { value: "newest", label: "جدیدترین" },
    { value: "oldest", label: "قدیمی‌ترین" },
    { value: "title", label: "الفبایی (نام)" },
]

const ALL = "__all__"

export function ProductFilters({ brands, categories }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const current = {
        brand: searchParams.get("brand") || "",
        category: searchParams.get("category") || "",
        stock: searchParams.get("stock") || "",
        sort: searchParams.get("sort") || "newest",
        q: searchParams.get("q") || "",
    }

    const hasActiveFilters = !!(current.brand || current.category || current.stock || (current.sort && current.sort !== "newest"))

    const setParam = useCallback(
        (key: string, value: string | null) => {
            const params = new URLSearchParams(searchParams.toString())
            if (!value || value === ALL) params.delete(key)
            else params.set(key, value)
            router.push(`${pathname}?${params.toString()}`)
        },
        [router, pathname, searchParams],
    )

    const clearAll = useCallback(() => {
        const params = new URLSearchParams()
        if (current.q) params.set("q", current.q) // عبارت جستجو حفظ شود
        router.push(`${pathname}?${params.toString()}`)
    }, [router, pathname, current.q])

    return (
        <div className="bg-card border border-border rounded-xl p-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-bold ml-1">
                    <SlidersHorizontal className="w-4 h-4" />
                    فیلتر
                </div>

                {/* دسته */}
                <Select value={current.category || ALL} onValueChange={(v) => setParam("category", v)}>
                    <SelectTrigger className="h-9 min-w-[130px] text-xs"><SelectValue placeholder="دسته‌بندی" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>همه دسته‌ها</SelectItem>
                        {categories.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>

                {/* برند */}
                <Select value={current.brand || ALL} onValueChange={(v) => setParam("brand", v)}>
                    <SelectTrigger className="h-9 min-w-[130px] text-xs"><SelectValue placeholder="برند" /></SelectTrigger>
                    <SelectContent className="max-h-72">
                        <SelectItem value={ALL}>همه برندها</SelectItem>
                        {brands.map((b) => <SelectItem key={b.slug} value={b.slug}>{b.name}</SelectItem>)}
                    </SelectContent>
                </Select>

                {/* وضعیت موجودی */}
                <Select value={current.stock || ALL} onValueChange={(v) => setParam("stock", v)}>
                    <SelectTrigger className="h-9 min-w-[120px] text-xs"><SelectValue placeholder="موجودی" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>همه وضعیت‌ها</SelectItem>
                        {STOCK_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                </Select>

                {/* مرتب‌سازی */}
                <Select value={current.sort} onValueChange={(v) => setParam("sort", v === "newest" ? null : v)}>
                    <SelectTrigger className="h-9 min-w-[140px] text-xs gap-1">
                        <ArrowDownWideNarrow className="w-3.5 h-3.5 text-muted-foreground" />
                        <SelectValue placeholder="مرتب‌سازی" />
                    </SelectTrigger>
                    <SelectContent>
                        {SORT_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                </Select>

                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearAll} className="h-9 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 gap-1">
                        <X className="w-3.5 h-3.5" /> پاک کردن فیلترها
                    </Button>
                )}
            </div>
        </div>
    )
}
