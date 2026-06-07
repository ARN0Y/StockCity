import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import { MapPin, Phone, Clock, MessageCircle, ShieldCheck, Navigation } from "lucide-react"

export const metadata: Metadata = {
    title: "تماس با ما",
    description: `راه‌های ارتباط با فروشگاه ${siteConfig.nameFa} — تلفن، واتساپ و آدرس در اصفهان.`,
}

export default function ContactPage() {
    const mapsQuery = encodeURIComponent(siteConfig.address)

    return (
        <div className="max-w-5xl mx-auto space-y-6 py-4">
            <div className="text-center space-y-2 mb-2">
                <h1 className="text-3xl font-black text-foreground">تماس با ما</h1>
                <p className="text-muted-foreground">خوشحال می‌شویم پاسخ‌گوی شما باشیم</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div className="space-y-4">
                    <a
                        href={`tel:${siteConfig.phoneRaw}`}
                        className="group flex items-center gap-4 bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all"
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-0.5">تماس تلفنی</p>
                            <p className="text-lg font-black text-foreground" dir="ltr">{siteConfig.phoneDisplay}</p>
                        </div>
                    </a>

                    <a
                        href={`https://wa.me/${siteConfig.whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-4 bg-card border border-border rounded-2xl p-5 hover:border-emerald-400 hover:shadow-md transition-all"
                    >
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-0.5">واتساپ (همین شماره)</p>
                            <p className="text-lg font-black text-foreground" dir="ltr">{siteConfig.phoneDisplay}</p>
                        </div>
                    </a>

                    <div className="flex items-start gap-4 bg-card border border-border rounded-2xl p-5">
                        <div className="w-12 h-12 rounded-xl bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">آدرس فروشگاه</p>
                            <p className="text-sm text-foreground leading-6">{siteConfig.address}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 bg-card border border-border rounded-2xl p-5">
                        <div className="w-12 h-12 rounded-xl bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">ساعت کاری</p>
                            <p className="text-sm text-foreground">{siteConfig.hours}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-6">{siteConfig.warrantyNote}</p>
                    </div>
                </div>

                
                <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
                    <iframe
                        title="موقعیت فروشگاه روی نقشه"
                        className="w-full flex-1 min-h-[360px]"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://maps.google.com/maps?q=${mapsQuery}&hl=fa&z=14&output=embed`}
                    />
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-primary hover:bg-primary dark:hover:bg-primary/90 text-white py-3.5 text-sm font-bold transition-colors"
                    >
                        <Navigation className="w-4 h-4" /> مسیریابی در گوگل مپ
                    </a>
                </div>
            </div>
        </div>
    )
}
