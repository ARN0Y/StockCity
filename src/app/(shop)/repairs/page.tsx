import type { Metadata } from "next"
import Link from "next/link"
import {
    Wrench,
    PhoneCall,
    Boxes,
    CheckCircle2,
    CircuitBoard,
    Power,
    Cpu,
    Hammer,
    ShieldCheck,
    Clock,
    BadgeCheck,
} from "lucide-react"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
    title: "تعمیرات",
    description: `خدمات تعمیرات تخصصی تجهیزات برق صنعتی در ${siteConfig.nameFa} — اینورتر، کلید اتوماتیک، کنتاکتور و ساخت تیغه پلاتین.`,
}

// متن‌های پیش‌فرض؛ به‌راحتی قابل ویرایش هستند.
const sections = [
    {
        num: "۰۱",
        icon: CircuitBoard,
        title: "تعمیر تخصصی اینورترهای صنعتی",
        text: "تعمیر انواع اینورتر (درایو) صنعتی برندهای معتبر تا رنج ۱۸۰۰ کیلووات، شامل عیب‌یابی برد کنترل و پاور، تعویض قطعات IGBT و خازن‌ها، و تست نهایی زیر بار. تمامی تعمیرات همراه با ضمانت‌نامه انجام می‌شود.",
        points: ["عیب‌یابی دقیق برد کنترل و پاور", "تعویض IGBT و قطعات پاور", "تست نهایی زیر بار و ضمانت‌نامه"],
    },
    {
        num: "۰۲",
        icon: Power,
        title: "تعمیر کلید اتوماتیک و کلید هوایی",
        text: "سرویس، تعمیر و کالیبراسیون انواع کلید اتوماتیک (MCCB) و کلید هوایی (ACB). بازسازی مکانیزم شارژ، تعویض کنتاکت‌های اصلی و تنظیم رله حفاظتی، به‌همراه تست عملکرد و اطمینان از ایمنی کامل.",
        points: ["بازسازی مکانیزم شارژ و فنر", "تعویض کنتاکت‌های اصلی و کمکی", "تنظیم و تست رله حفاظتی"],
    },
    {
        num: "۰۳",
        icon: Cpu,
        title: "تعمیر و بازسازی کنتاکتورهای صنعتی",
        text: "تعمیر و بازسازی انواع کنتاکتور صنعتی در تناژهای مختلف؛ شامل تعویض بوبین، تیغه‌های ثابت و متحرک و فنرها. کنتاکتورهای بازسازی‌شده پس از تست کامل با کیفیتی نزدیک به کالای نو تحویل داده می‌شوند.",
        points: ["تعویض بوبین و فنرها", "بازسازی تیغه‌های ثابت و متحرک", "تست عملکرد و تحویل تضمینی"],
    },
    {
        num: "۰۴",
        icon: Hammer,
        title: "ساخت و طراحی تیغه پلاتین",
        text: "ساخت و طراحی انواع تیغه پلاتین (کنتاکت نقره) برای کلید و کنتاکتورهای صنعتی، مطابق با نمونه اصلی و در تیراژ دلخواه. استفاده از آلیاژ مرغوب برای افزایش طول عمر و کاهش مقاومت تماسی.",
        points: ["ساخت مطابق نمونه اصلی", "آلیاژ نقره مرغوب و بادوام", "تولید در تیراژ دلخواه"],
    },
]

const perks = [
    { icon: ShieldCheck, title: "ضمانت‌نامه", text: "تمام تعمیرات دارای ضمانت کتبی است." },
    { icon: BadgeCheck, title: "کادر متخصص", text: "تیم فنی مجرب با تجهیزات تخصصی." },
    { icon: Clock, title: "تحویل سریع", text: "کوتاه‌ترین زمان ممکن برای تعمیر." },
]

export default function RepairsPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-12 py-4">
            {/* هدر صفحه (هم‌سبک با صفحه درباره ما) */}
            <section className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-card border border-transparent dark:border-border text-white dark:text-foreground p-8 md:p-12">
                <div className="absolute -left-24 -top-24 h-80 w-80 bg-primary/25 rounded-full blur-[110px]" />
                <div className="absolute -right-16 bottom-0 h-64 w-64 bg-primary/10 rounded-full blur-[90px]" />
                <div className="relative">
                    <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-primary/15 rounded-full px-4 py-1.5 text-sm mb-5">
                        <Wrench className="w-4 h-4 text-primary" /> خدمات تعمیرات
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black mb-4">تعمیرات تخصصی تجهیزات برق صنعتی</h1>
                    <p className="text-slate-300 dark:text-muted-foreground leading-8 text-lg max-w-2xl">
                        تیم فنی {siteConfig.nameFa} با تجربه و تجهیزات تخصصی، خدمات تعمیر و بازسازی انواع تجهیزات برق صنعتی
                        را با تضمین کیفیت ارائه می‌دهد. برای استعلام و هماهنگی با ما در تماس باشید.
                    </p>
                </div>
            </section>

            {/* مزیت‌ها */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {perks.map((p) => (
                    <div key={p.title} className="bg-card border border-border rounded-2xl p-5 flex items-start gap-3.5 hover:shadow-md transition-all">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <p.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground mb-1">{p.title}</h3>
                            <p className="text-sm text-muted-foreground leading-6">{p.text}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* چهار بخش دوستونی متناوب (متن + پنل تزئینی) */}
            <div className="space-y-8 md:space-y-10">
                {sections.map((s, i) => {
                    const reverse = i % 2 === 1
                    const Icon = s.icon
                    return (
                        <section
                            key={s.title}
                            className="group grid md:grid-cols-2 gap-6 md:gap-8 items-stretch bg-card border border-border rounded-3xl p-5 sm:p-6 md:p-8 hover:shadow-lg hover:border-primary/30 transition-all"
                        >
                            {/* متن */}
                            <div className={`flex flex-col justify-center ${reverse ? "md:order-2" : "md:order-1"}`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-black text-foreground">{s.title}</h2>
                                </div>
                                <p className="text-muted-foreground leading-8 mb-5">{s.text}</p>
                                <ul className="space-y-2.5">
                                    {s.points.map((p) => (
                                        <li key={p} className="flex items-center gap-2.5 text-sm text-foreground">
                                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* پنل تزئینی (جایگزین عکس) */}
                            <div className={reverse ? "md:order-1" : "md:order-2"}>
                                <div className="relative h-full min-h-52 rounded-2xl bg-gradient-to-br from-primary/12 via-card to-muted border border-border overflow-hidden flex items-center justify-center">
                                    <div className="absolute -right-10 -top-10 h-40 w-40 bg-primary/15 rounded-full blur-2xl" />
                                    <div className="absolute -left-8 -bottom-8 h-32 w-32 bg-primary/10 rounded-full blur-xl" />
                                    <span className="absolute top-3 left-5 text-8xl font-black leading-none text-primary/10 select-none">
                                        {s.num}
                                    </span>
                                    <div className="relative w-24 h-24 rounded-3xl bg-background/70 backdrop-blur border border-border shadow-sm text-primary flex items-center justify-center transition-transform group-hover:scale-105">
                                        <Icon className="w-11 h-11" />
                                    </div>
                                </div>
                            </div>
                        </section>
                    )
                })}
            </div>

            {/* دعوت به تماس */}
            <section className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-card border border-transparent dark:border-border text-white dark:text-foreground p-8 md:p-10 text-center">
                <div className="absolute -right-20 -top-20 h-64 w-64 bg-primary/20 rounded-full blur-[100px]" />
                <div className="relative">
                    <h2 className="text-xl md:text-2xl font-black mb-2">به تعمیر تجهیزات صنعتی نیاز دارید؟</h2>
                    <p className="text-sm text-slate-300 dark:text-muted-foreground mb-6 max-w-xl mx-auto leading-7">
                        برای مشاوره، استعلام هزینه و هماهنگی تعمیرات با کارشناسان ما تماس بگیرید.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <a href={`tel:${siteConfig.phoneRaw}`} className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors">
                            <PhoneCall className="w-4 h-4" /> {siteConfig.phoneDisplay}
                        </a>
                        <Link href="/products" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 dark:bg-muted dark:hover:bg-muted/70 text-white dark:text-foreground px-6 py-3 rounded-xl text-sm font-bold transition-colors">
                            <Boxes className="w-4 h-4" /> مشاهده محصولات
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
