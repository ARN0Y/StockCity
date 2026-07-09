import Link from "next/link"
import { ArrowLeft, Box, Cpu, Gauge, SquareStack, Layers, Boxes } from "lucide-react"
import { getProducts } from "@/app/actions/products"
import { listCategoriesWithCounts } from "@/lib/db"
import { ProductGrid } from "@/components/product/product-grid"
import { HeroSlideshow } from "@/components/home/hero-slideshow"

export const dynamic = "force-dynamic"

const CATEGORY_ICONS: Record<string, typeof Cpu> = {
    contactor: Cpu,
    inverter: Gauge,
    miniature: SquareStack,
    mccb: Layers,
    misc: Boxes,
}

export default async function HomePage() {
    const { data: latestProducts, total } = await getProducts(1)
    const categories = listCategoriesWithCounts()

    return (
        <div className="space-y-12 sm:space-y-14 pb-12">

            {/* اسلایدشوی بنرها */}
            <HeroSlideshow />

            {/* دسته‌بندی‌ها */}
            <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {categories.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.slug] ?? Box
                    return (
                        <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            className="group bg-card border border-border rounded-2xl p-4 flex items-center gap-3 hover:border-primary/40 hover:shadow-lg transition-all"
                        >
                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors dark:bg-primary/15">
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-foreground text-sm truncate">{cat.name}</h3>
                                <p className="text-[11px] text-muted-foreground">{cat.product_count} محصول</p>
                            </div>
                        </Link>
                    )
                })}
            </section>

            {/* جدیدترین محصولات */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-7 bg-primary rounded-full" />
                        <h2 className="text-2xl font-black tracking-tight text-foreground">جدیدترین محصولات</h2>
                    </div>
                    <Link href="/products" className="text-sm font-bold text-muted-foreground hover:text-primary flex items-center gap-1 hover:gap-2 transition-all">
                        همه محصولات <ArrowLeft className="w-4 h-4" />
                    </Link>
                </div>

                <ProductGrid key="homepage-grid" initialProducts={latestProducts as any[]} initialTotal={total} mode="button" />
            </section>
        </div>
    )
}
