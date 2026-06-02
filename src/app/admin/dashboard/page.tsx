import Link from "next/link"
import { counts, listProducts, listCategoriesWithCounts } from "@/lib/db"
import {
    Package,
    Boxes,
    Tag,
    Plus,
    List,
    FolderTree,
    ArrowLeft,
    CheckCircle2,
    PhoneCall,
} from "lucide-react"

export const dynamic = "force-dynamic"

export default function DashboardPage() {
    const c = counts()
    const recent = listProducts(1, 5, { sort: "newest" }).data
    const cats = listCategoriesWithCounts()

    const stats = [
        { label: "محصولات", value: c.products, icon: Package, tint: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
        { label: "برندها", value: c.brands, icon: Tag, tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
        { label: "دسته‌بندی‌ها", value: c.categories, icon: Boxes, tint: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-foreground">داشبورد</h1>
                    <p className="text-sm text-muted-foreground mt-1">نمای کلی فروشگاه استوک سیتی</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center gap-2 bg-foreground hover:bg-primary text-background hover:text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" /> افزودن محصول جدید
                </Link>
            </div>

            {/* آمار */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((s) => (
                    <div key={s.label} className="bg-card rounded-2xl border border-border p-5">
                        <div className="flex items-center justify-between">
                            <div className={`p-2.5 rounded-xl ${s.tint}`}>
                                <s.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-3xl font-black text-foreground mt-4">{s.value}</p>
                        <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* آخرین محصولات */}
                <div className="lg:col-span-2 bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                        <h2 className="font-bold text-foreground flex items-center gap-2">
                            <List className="w-4 h-4 text-muted-foreground" /> آخرین محصولات
                        </h2>
                        <Link href="/admin/products" className="text-xs text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all">
                            همه <ArrowLeft className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="divide-y divide-border">
                        {recent.map((p) => (
                            <Link
                                key={p.id}
                                href={`/admin/products/${p.id}`}
                                className="flex items-center justify-between px-5 py-3 hover:bg-accent transition-colors"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{p.model_number}</p>
                                </div>
                                {p.stock_status === "in_stock" ? (
                                    <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                                        <CheckCircle2 className="w-3 h-3" /> موجود
                                    </span>
                                ) : (
                                    <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">
                                        <PhoneCall className="w-3 h-3" /> استعلام
                                    </span>
                                )}
                            </Link>
                        ))}
                        {recent.length === 0 && (
                            <p className="px-5 py-8 text-center text-sm text-muted-foreground">محصولی ثبت نشده است</p>
                        )}
                    </div>
                </div>

                {/* دسته‌بندی‌ها */}
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                        <h2 className="font-bold text-foreground flex items-center gap-2">
                            <FolderTree className="w-4 h-4 text-muted-foreground" /> دسته‌بندی‌ها
                        </h2>
                        <Link href="/admin/categories" className="text-xs text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all">
                            مدیریت <ArrowLeft className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="p-3 space-y-1">
                        {cats.map((cat) => (
                            <div key={cat.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent">
                                <span className="text-sm text-foreground">{cat.name}</span>
                                <span className="text-xs font-bold text-muted-foreground">{cat.product_count}</span>
                            </div>
                        ))}
                        {cats.length === 0 && (
                            <p className="px-3 py-6 text-center text-sm text-muted-foreground">دسته‌ای نیست</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
