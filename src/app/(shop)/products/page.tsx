import { getProducts } from "@/app/actions/products"
import { listBrands, listCategories } from "@/lib/db"
import { ProductGrid } from "@/components/product/product-grid"
import { ProductFilters } from "@/components/product/product-filters"
import { LayoutGrid, SearchX } from "lucide-react"
import type { StockStatus } from "@/lib/db"

export const dynamic = "force-dynamic"

interface ProductsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const STOCK_VALUES = ["in_stock", "call_for_price", "out_of_stock"]
const SORT_VALUES = ["newest", "oldest", "title"]

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const params = await searchParams
    const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined)

    const query = str(params.q)
    const brandSlug = str(params.brand)
    const categorySlug = str(params.category)
    const stockRaw = str(params.stock)
    const sortRaw = str(params.sort)

    const stockStatus = stockRaw && STOCK_VALUES.includes(stockRaw) ? (stockRaw as StockStatus) : undefined
    const sort = sortRaw && SORT_VALUES.includes(sortRaw) ? (sortRaw as "newest" | "oldest" | "title") : undefined

    const filters = { query, brandSlug, categorySlug, stockStatus, sort }

    const [{ data: initialProducts, total }, brands, categories] = await Promise.all([
        getProducts(1, filters),
        Promise.resolve(listBrands()),
        Promise.resolve(listCategories()),
    ])

    return (
        <div className="space-y-5">
            <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-primary" />
                    <h1 className="text-lg font-bold text-foreground">
                        {query ? `نتایج جستجو برای: «${query}»` : "همه محصولات"}
                        <span className="mr-2 text-sm font-normal text-muted-foreground">({total} محصول)</span>
                    </h1>
                </div>
            </div>

            <ProductFilters
                brands={brands.map((b) => ({ slug: b.slug, name: b.name }))}
                categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
            />

            {initialProducts && initialProducts.length > 0 ? (
                <ProductGrid
                    key={`products-${query || "all"}-${brandSlug || "all"}-${categorySlug || "all"}-${stockStatus || "all"}-${sort || "newest"}`}
                    initialProducts={initialProducts as any[]}
                    initialTotal={total}
                    mode="button"
                    filters={filters}
                />
            ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-card rounded-xl border border-dashed border-border">
                    <SearchX className="w-12 h-12 text-muted-foreground/40 mb-4" />
                    <p className="text-lg font-medium text-foreground">محصولی یافت نشد!</p>
                    <p className="text-sm text-muted-foreground mt-2">فیلترها را تغییر دهید یا عبارت دیگری را امتحان کنید.</p>
                </div>
            )}
        </div>
    )
}
