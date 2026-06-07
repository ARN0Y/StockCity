import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Phone, CheckCircle2, ShieldCheck, Truck, Box, FileText, ChevronLeft, MessageCircle, AlertCircle, Layers } from "lucide-react"
import { getProductByModel } from "@/lib/db"
import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ProductGallery } from "@/components/product/product-gallery"

export const dynamic = "force-dynamic"

interface PageProps {
    params: Promise<{ model: string }>
}

const formatKey = (key: string) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { model } = await params
    const product = getProductByModel(decodeURIComponent(model)) as any
    if (!product) return { title: "محصول یافت نشد" }

    const specsText = product.specifications
        ? Object.entries(product.specifications).map(([k, v]) => `${k}: ${v}`).join("، ")
        : ""
    const desc =
        `خرید ${product.title}${product.brand?.name ? ` برند ${product.brand.name}` : ""} با کد فنی ${product.model_number}. ` +
        (specsText ? `مشخصات: ${specsText}. ` : "") +
        `استعلام قیمت و موجودی از ${siteConfig.nameFa}.`

    const images = (product.images || []).filter(Boolean).slice(0, 1)

    return {
        title: `${product.title}${product.brand?.name ? ` | ${product.brand.name}` : ""}`,
        description: desc.slice(0, 300),
        openGraph: {
            title: `${product.title} — ${siteConfig.nameFa}`,
            description: desc.slice(0, 300),
            type: "website",
            images: images.length ? images : undefined,
        },
        twitter: {
            card: images.length ? "summary_large_image" : "summary",
            title: product.title,
            description: desc.slice(0, 200),
        },
    }
}

export default async function ProductPage({ params }: PageProps) {
    const resolvedParams = await params

    const product = getProductByModel(decodeURIComponent(resolvedParams.model)) as any

    if (!product) notFound()

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        sku: product.model_number,
        mpn: product.model_number,
        ...(product.brand?.name ? { brand: { "@type": "Brand", name: product.brand.name } } : {}),
        ...(product.images?.length ? { image: product.images } : {}),
        description: product.description
            ? String(product.description).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500)
            : product.title,
        offers: {
            "@type": "Offer",
            availability:
                product.stock_status === "in_stock"
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
            priceCurrency: "IRR",
            seller: { "@type": "Organization", name: siteConfig.nameFa },
        },
    }

    return (
        <div className="w-full max-w-[1800px] mx-auto px-4 md:px-6 py-6 animate-in fade-in duration-500 pb-24">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">

                <div className="grid grid-cols-1 lg:grid-cols-12">
                    
                    <div className="lg:col-span-5 xl:col-span-4">
                        <ProductGallery images={product.images || []} title={product.title} />
                    </div>

                    
                    <div className="lg:col-span-7 xl:col-span-8 p-5 sm:p-6 lg:p-10 flex flex-col bg-card">
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-6 border-b border-border">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground flex-wrap">
                                <span>فروشگاه</span>
                                <ChevronLeft className="w-3 h-3 text-muted-foreground/50" />
                                <span>{product.category?.name}</span>
                                <ChevronLeft className="w-3 h-3 text-muted-foreground/50" />
                                <span className="text-foreground">{product.brand?.name}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg self-start">
                                <span className="text-xs text-muted-foreground">کد فنی:</span>
                                <span className="font-mono text-sm font-bold text-foreground tracking-wide select-all">{product.model_number}</span>
                            </div>
                        </div>

                        
                        <div className="mb-8">
                            <h1 className="text-2xl lg:text-4xl font-black text-foreground leading-tight mb-4">
                                {product.title}
                            </h1>
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold border border-primary/20 rounded-lg">
                                    برند: {product.brand?.name}
                                </div>
                                {product.stock_status === "in_stock" ? (
                                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 rounded-lg flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        {product.stock_quantity ? `موجود در انبار (${product.stock_quantity} عدد)` : "موجود در انبار"}
                                    </div>
                                ) : (
                                    <div className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20 rounded-lg flex items-center gap-1.5">
                                        <AlertCircle className="w-3.5 h-3.5" /> استعلام موجودی
                                    </div>
                                )}
                            </div>
                        </div>

                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-10">
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
                                    <Layers className="w-4 h-4 text-muted-foreground" />
                                    مشخصات فنی کلیدی
                                </h3>
                                <div>
                                    {product.specifications && Object.entries(product.specifications).slice(0, 5).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-center py-2.5 border-b border-dashed border-border last:border-0 text-sm">
                                            <span className="text-muted-foreground font-medium">{formatKey(key)}</span>
                                            <span className="font-mono font-bold text-foreground" dir="ltr">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-muted/50 p-5 rounded-xl border border-border">
                                <h3 className="text-sm font-bold text-foreground mb-3">مزایای این محصول</h3>
                                <ul className="space-y-2.5">
                                    {product.key_features && product.key_features.length > 0 ? (
                                        product.key_features.slice(0, 4).map((feat: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-snug">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                {feat}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-xs text-muted-foreground italic">اطلاعات تکمیلی ثبت نشده است.</li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="flex-1" />

                        
                        <div className="mt-6 bg-slate-900 dark:bg-card dark:border dark:border-border rounded-xl p-5 shadow-lg flex flex-col gap-4">
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="text-xs text-slate-400 mb-1">مشاوره فنی و خرید</div>
                                    <a href={`tel:${siteConfig.phoneRaw}`} className="text-white font-bold text-lg block" dir="ltr">
                                        {siteConfig.phoneDisplay}
                                    </a>
                                </div>
                                <Phone className="w-8 h-8 text-primary shrink-0" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button size="lg" className="h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md text-sm sm:text-base" asChild>
                                    <a href={`tel:${siteConfig.phoneRaw}`}>
                                        <Phone className="w-5 h-5 ml-2" />
                                        تماس بگیرید
                                    </a>
                                </Button>
                                <Button size="lg" className="h-12 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-lg shadow-sm text-sm sm:text-base" asChild>
                                    <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer">
                                        <MessageCircle className="w-5 h-5 ml-2 text-emerald-600" />
                                        واتساپ
                                    </a>
                                </Button>
                            </div>
                        </div>

                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-6 pt-4 border-t border-border">
                            <div className="flex items-center justify-center gap-2 py-2">
                                <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                                <span className="text-xs font-bold text-muted-foreground">ضمانت اصالت و سلامت</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 py-2 sm:border-r border-border">
                                <Truck className="w-5 h-5 text-muted-foreground" />
                                <span className="text-xs font-bold text-muted-foreground">ارسال به سراسر کشور</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 py-2 sm:border-r border-border">
                                <Box className="w-5 h-5 text-muted-foreground" />
                                <span className="text-xs font-bold text-muted-foreground">بسته‌بندی صنعتی</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="bg-border h-px" />

                
                <div className="bg-muted/40 p-4 sm:p-6 lg:p-10">
                    <div className="max-w-[1100px] mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-primary/15 text-primary flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-foreground leading-tight">نقد و بررسی تخصصی</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">راهنمای کامل {product.title}</p>
                            </div>
                        </div>

                        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 sm:p-10 lg:p-12">
                            {product.description ? (
                                <article
                                    className="
                                        prose prose-slate dark:prose-invert prose-lg max-w-none
                                        prose-headings:font-black prose-headings:text-foreground prose-headings:scroll-mt-24
                                        prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:pr-4 prose-h2:border-r-4 prose-h2:border-primary first:prose-h2:mt-0
                                        prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                                        prose-p:text-muted-foreground prose-p:leading-[2.1] prose-p:text-justify prose-p:mb-6 prose-p:text-[15px] md:prose-p:text-[17px]
                                        prose-ul:my-6 prose-ul:mr-0 prose-ul:pr-0 prose-ul:list-none prose-ul:space-y-3
                                        prose-ol:list-decimal prose-ol:mr-0 prose-ol:pr-6
                                        prose-li:text-muted-foreground prose-li:relative prose-li:pr-7 prose-li:leading-8
                                        prose-img:rounded-xl prose-img:border prose-img:border-border prose-img:shadow-md prose-img:my-8 prose-img:bg-white prose-img:p-2 prose-img:mx-auto
                                        prose-table:w-full prose-table:border-collapse prose-table:text-sm prose-table:my-8 prose-table:overflow-hidden prose-table:rounded-xl prose-table:border prose-table:border-border
                                        prose-thead:bg-slate-900 dark:prose-thead:bg-muted
                                        prose-th:text-white dark:prose-th:text-foreground prose-th:font-bold prose-th:p-4 prose-th:text-right prose-th:text-sm
                                        prose-td:p-4 prose-td:border-t prose-td:border-border prose-td:text-muted-foreground
                                        prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                                        prose-strong:font-bold prose-strong:text-foreground
                                        prose-blockquote:border-r-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-l-lg prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-foreground
                                        [&_ul>li]:before:content-[''] [&_ul>li]:before:absolute [&_ul>li]:before:right-0 [&_ul>li]:before:top-3 [&_ul>li]:before:w-2 [&_ul>li]:before:h-2 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-primary
                                        prose-tr:even:bg-muted/40
                                    "
                                    dir="rtl"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            ) : (
                                <div className="p-10 text-center text-muted-foreground bg-muted/40 border border-dashed border-border rounded-xl">
                                    <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                                    توضیحات تکمیلی برای این محصول هنوز درج نشده است.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}