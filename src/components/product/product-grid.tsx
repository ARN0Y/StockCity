"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ProductCard } from "@/components/product/product-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { getProducts } from "@/app/actions/products"
import type { Product } from "@/types/collection"

interface ProductGridProps {
    initialProducts: Product[]
    initialTotal: number
    mode?: "button" | "infinite"
    filters?: {
        categorySlug?: string
        query?: string
        brandSlug?: string
        stockStatus?: "in_stock" | "call_for_price" | "out_of_stock"
        sort?: "newest" | "oldest" | "title"
    }
}

export function ProductGrid({
                                initialProducts,
                                initialTotal,
                                mode = "button",
                                filters
                            }: ProductGridProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts || [])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(initialTotal)

    // محاسبه اینکه آیا صفحه بعدی وجود دارد
    const hasMore = products.length < total

    // رفرنس برای جلوگیری از لود همزمان چندباره
    const loadingRef = useRef(false)
    const observerRef = useRef<IntersectionObserver | null>(null)
    const sentinelRef = useRef<HTMLDivElement | null>(null)

    // ریست کردن وقتی initialProducts عوض میشه
    // (مثلاً وقتی key کامپوننت عوض شد)
    useEffect(() => {
        setProducts(initialProducts || [])
        setPage(1)
        setTotal(initialTotal)
        loadingRef.current = false
    }, [initialProducts, initialTotal])

    // تابع لود صفحه بعدی
    const loadMore = useCallback(async () => {
        if (loadingRef.current || !hasMore) return
        loadingRef.current = true
        setLoading(true)

        try {
            const nextPage = page + 1
            const result = await getProducts(nextPage, filters)
            const newProducts = (result.data || []) as Product[]

            if (newProducts.length > 0) {
                setProducts(prev => {
                    // حذف تکراری‌ها
                    const existingIds = new Set(prev.map(p => p.id))
                    const unique = newProducts.filter(p => !existingIds.has(p.id))
                    return [...prev, ...unique]
                })
                setPage(nextPage)
                // آپدیت total از سرور (ممکنه تغییر کرده باشه)
                setTotal(result.total)
            } else {
                // سرور گفت خالیه، total رو بزار همون تعداد فعلی
                setTotal(prev => Math.min(prev, products.length))
            }
        } catch (error) {
            console.error("Failed to load more products:", error)
        } finally {
            setLoading(false)
            loadingRef.current = false
        }
    }, [page, hasMore, filters, products.length])

    useEffect(() => {
        // فقط در حالت infinite فعال شو
        if (mode !== "infinite") return

        // observer قبلی رو پاک کن
        if (observerRef.current) {
            observerRef.current.disconnect()
        }

        // اگه دیگه چیزی نیست لود نکن
        if (!hasMore) return

        const observer = new IntersectionObserver(
            (entries) => {
                // فقط وقتی sentinel دیده شد و در حال لود نیستیم
                if (entries[0].isIntersecting && !loadingRef.current) {
                    loadMore()
                }
            },
            {
                threshold: 0.1,
                rootMargin: "200px" // کمی زودتر شروع به لود کن
            }
        )

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current)
        }

        observerRef.current = observer

        return () => {
            observer.disconnect()
        }
    }, [mode, hasMore, loadMore])

    // رندر
    return (
        <div className="space-y-10">
            {/* گرید محصولات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* بخش لود بیشتر */}
            <div className="flex justify-center pt-4 pb-8">
                {hasMore ? (
                    mode === "button" ? (
                        <Button
                            onClick={loadMore}
                            disabled={loading}
                            variant="outline"
                            size="lg"
                            className="min-w-[200px] h-12 shadow-sm text-base"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    در حال بارگذاری...
                                </>
                            ) : (
                                "نمایش محصولات بیشتر"
                            )}
                        </Button>
                    ) : (
                        <div
                            ref={sentinelRef}
                            className="flex items-center gap-2 text-muted-foreground py-8"
                        >
                            {loading && (
                                <>
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    <span className="text-sm">
                                        در حال دریافت محصولات...
                                    </span>
                                </>
                            )}
                        </div>
                    )
                ) : (
                    products.length > 0 && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-muted-foreground text-sm">
                            <span className="w-2 h-2 bg-muted-foreground/50 rounded-full" />
                            تمام محصولات نمایش داده شدند
                            ({total} محصول)
                        </div>
                    )
                )}
            </div>
        </div>
    )
}