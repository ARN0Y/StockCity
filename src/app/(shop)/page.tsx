import Link from "next/link"
import {
    Database, Box, ShieldCheck, Zap, PenTool,
    ArrowLeft, Cpu, ToggleRight, SquareStack, Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProducts } from "@/app/actions/products"
import { listCategoriesWithCounts } from "@/lib/db"
import { ProductGrid } from "@/components/product/product-grid"
import { siteConfig } from "@/lib/site-config"

export const dynamic = "force-dynamic"

const CATEGORY_ICONS: Record<string, typeof Cpu> = {
    contactor: Cpu,
    "contactor-reversing": ToggleRight,
    miniature: SquareStack,
    mccb: Layers,
}

export default async function HomePage() {
    const { data: latestProducts, total } = await getProducts(1)
    const categories = listCategoriesWithCounts()

    return (
        <div className="space-y-12 sm:space-y-14 pb-12">
            {/* HERO */}
            <section className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-sm">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.04)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.04)_1px,transparent_1px)] bg-[size:26px_26px]" />
                <div className="absolute -right-24 -top-24 h-[480px] w-[480px] bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center px-5 py-12 sm:px-6 sm:py-14 md:px-12 md:py-16">
                    <div className="space-y-7">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                            </span>
                            موجودی انبار به‌روز است
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
                            تجهیزات <span className="text-primary">برق صنعتی</span>
                            <span className="text-muted-foreground font-light block text-2xl mt-3 lg:text-3xl">
                                با گارانتی اصالت و سلامت
                            </span>
                        </h1>

                        <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                            {siteConfig.nameFa} تأمین‌کننده‌ی انواع کنتاکتور، کلید اتوماتیک و کلید مینیاتوری
                            از برندهای معتبر <span className="font-bold text-foreground">اشنایدر، زیمنس، ال‌اس و هیوندای</span>.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button size="lg" className="h-14 px-8 text-base bg-slate-900 hover:bg-primary text-white shadow-lg transition-all rounded-xl dark:bg-primary dark:hover:bg-primary/90" asChild>
                                <Link href="/products">
                                    <Database className="ml-2 h-5 w-5" />
                                    مشاهده موجودی انبار
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-xl" asChild>
                                <a href={`tel:${siteConfig.phoneRaw}`}>مشاوره و استعلام قیمت</a>
                            </Button>
                        </div>
                    </div>

                    <div className="hidden lg:grid grid-cols-2 gap-4">
                        {categories.slice(0, 4).map((cat) => {
                            const Icon = CATEGORY_ICONS[cat.slug] ?? Box
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/category/${cat.slug}`}
                                    className="group relative bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-lg transition-all overflow-hidden"
                                >
                                    <div className="absolute -left-6 -bottom-6 h-20 w-20 bg-primary/5 rounded-full group-hover:scale-150 transition-transform" />
                                    <div className="relative">
                                        <div className="w-11 h-11 rounded-xl bg-slate-900 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors dark:bg-primary/15">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-bold text-foreground text-sm">{cat.name}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">{cat.product_count} محصول</p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>

                <div className="relative z-10 border-t border-border bg-muted/40 py-7 px-5 sm:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: Box, label: "تنوع برند", val: "+۳۰ برند" },
                            { icon: ShieldCheck, label: `گارانتی ${siteConfig.warrantyBrand}`, val: "تعویض تضمینی" },
                            { icon: Zap, label: "ارسال", val: "سراسر کشور" },
                            { icon: PenTool, label: "مشاوره فنی", val: "رایگان" },
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center gap-3 justify-center md:justify-start">
                                <div className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm text-primary shrink-0">
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                    <p className="text-sm font-bold text-foreground">{stat.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* دسته‌بندی‌ها — موبایل */}
            <section className="lg:hidden grid grid-cols-2 gap-3">
                {categories.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.slug] ?? Box
                    return (
                        <Link key={cat.id} href={`/category/${cat.slug}`} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-primary flex items-center justify-center shrink-0 dark:bg-primary/15">
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

            {/* محصولات */}
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
