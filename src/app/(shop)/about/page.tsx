import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import {
    ShieldCheck,
    Truck,
    PhoneCall,
    Award,
    Boxes,
    Zap,
    MapPin,
    Clock,
} from "lucide-react"

export const metadata: Metadata = {
    title: "درباره ما",
    description: `درباره فروشگاه ${siteConfig.nameFa} — تأمین‌کننده تخصصی تجهیزات برق صنعتی در اصفهان.`,
}

const values = [
    { icon: ShieldCheck, title: "اصالت کالا", text: "تضمین اصالت و سلامت تمام محصولات عرضه‌شده." },
    { icon: Award, title: "گارانتی Patvaz", text: siteConfig.warrantyNote },
    { icon: Boxes, title: "تنوع بالا", text: "بیش از ۳۰ برند معتبر در دسته‌های مختلف برق صنعتی." },
    { icon: Truck, title: "ارسال سراسری", text: "ارسال سریع و مطمئن به سراسر کشور." },
    { icon: PhoneCall, title: "مشاوره فنی", text: "راهنمایی تخصصی برای انتخاب درست محصول." },
    { icon: Zap, title: "قیمت رقابتی", text: "عرضه مستقیم با بهترین قیمت بازار." },
]

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-10 py-4">
            
            <section className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-card border border-transparent dark:border-border text-white dark:text-foreground p-8 md:p-12">
                <div className="absolute -left-24 -top-24 h-80 w-80 bg-primary/25 rounded-full blur-[110px]" />
                <div className="absolute -right-16 bottom-0 h-64 w-64 bg-primary/10 rounded-full blur-[90px]" />
                <div className="relative">
                    <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-primary/15 rounded-full px-4 py-1.5 text-sm mb-5">
                        <Zap className="w-4 h-4 text-primary" /> {siteConfig.nameEn}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black mb-4">درباره {siteConfig.nameFa}</h1>
                    <p className="text-slate-300 dark:text-muted-foreground leading-8 text-lg max-w-2xl">
                        {siteConfig.nameFa} ({siteConfig.nameEn}) تأمین‌کننده‌ی تخصصی تجهیزات برق صنعتی و اتوماسیون است.
                        ما با عرضه‌ی انواع کنتاکتور، کلید اتوماتیک و کلید مینیاتوری از برندهای معتبر جهانی،
                        نیاز پیمانکاران، تابلوسازان و صنعتگران را با تضمین اصالت کالا و قیمت رقابتی برطرف می‌کنیم.
                    </p>
                </div>
            </section>

            
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {values.map((v) => (
                    <div key={v.title} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                            <v.icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-foreground mb-1.5">{v.title}</h3>
                        <p className="text-sm text-muted-foreground leading-6">{v.text}</p>
                    </div>
                ))}
            </section>

            
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-black text-foreground mb-5">اطلاعات تماس</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs text-muted-foreground mb-0.5">آدرس</p>
                            <p className="text-sm text-foreground leading-6">{siteConfig.address}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <PhoneCall className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs text-muted-foreground mb-0.5">تلفن</p>
                            <a href={`tel:${siteConfig.phoneRaw}`} className="text-sm font-bold text-foreground hover:text-primary" dir="ltr">
                                {siteConfig.phoneDisplay}
                            </a>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs text-muted-foreground mb-0.5">ساعت کاری</p>
                            <p className="text-sm text-foreground">{siteConfig.hours}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/contact" className="inline-flex items-center gap-2 bg-slate-900 dark:bg-primary hover:bg-primary dark:hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                        <PhoneCall className="w-4 h-4" /> تماس با ما
                    </Link>
                    <Link href="/products" className="inline-flex items-center gap-2 border border-border hover:bg-muted/50 text-foreground px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                        <Boxes className="w-4 h-4" /> مشاهده محصولات
                    </Link>
                </div>
            </section>
        </div>
    )
}
