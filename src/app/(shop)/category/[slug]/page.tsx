import { notFound } from "next/navigation"
import { getCategoryBySlug } from "@/lib/db"
import { ProductGrid } from "@/components/product/product-grid"
import { Layers, PackageSearch } from "lucide-react"
import { getProducts } from "@/app/actions/products"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

interface CategoryPageProps {
    params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params

    const category = getCategoryBySlug(slug)

    if (!category) {
        notFound()
    }

    const { data: initialProducts, total } = await getProducts(1, {
        categorySlug: slug
    })

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-card border border-border rounded-2xl shadow-sm">
                        <Layers className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                {category.name}
                            </h1>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 h-6">
                                {total} محصول
                            </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1.5 text-sm">
                            لیست قیمت و موجودی انبار اتوماسیون صنعتی
                        </p>
                    </div>
                </div>
            </div>

            {initialProducts && initialProducts.length > 0 ? (
                <ProductGrid
                    key={`cat-${slug}`}
                    initialProducts={initialProducts as any[]}
                    initialTotal={total}
                    mode="infinite"
                    filters={{ categorySlug: slug }}
                />
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-card border border-dashed border-border rounded-3xl">
                    <div className="bg-muted/50 p-4 rounded-full mb-4">
                        <PackageSearch className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                        محصولی یافت نشد
                    </h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                        در حال حاضر کالایی در دسته‌بندی {category.name} موجود نیست.
                    </p>
                </div>
            )}
        </div>
    )
}