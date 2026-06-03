import Link from "next/link"
import { MapPin, Phone, Clock, MessageCircle, ShieldCheck, Send, Instagram } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

interface FooterContact {
    nameFa: string
    address: string
    phoneDisplay: string
    phoneRaw: string
    whatsapp: string
    hours: string
    warrantyNote: string
    telegram?: string
    instagram?: string
}

export function Footer({ contact }: { contact?: FooterContact }) {
    const cfg: FooterContact = contact ?? {
        nameFa: siteConfig.nameFa,
        address: siteConfig.address,
        phoneDisplay: siteConfig.phoneDisplay,
        phoneRaw: siteConfig.phoneRaw,
        whatsapp: siteConfig.whatsapp,
        hours: siteConfig.hours,
        warrantyNote: siteConfig.warrantyNote,
    }

    return (
        <footer className="bg-slate-900 dark:bg-card text-slate-300 dark:text-muted-foreground pt-12 mt-auto border-t border-slate-800 dark:border-border">
            <div className="container mx-auto px-6 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* برند */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black text-white dark:text-foreground tracking-tighter">
                            Stock<span className="text-primary">City</span>
                            <span className="block text-sm font-medium text-slate-400 dark:text-muted-foreground mt-1">{cfg.nameFa}</span>
                        </h3>
                        <p className="text-sm leading-7 text-slate-400 dark:text-muted-foreground text-justify">
                            {siteConfig.tagline}. تأمین انواع کنتاکتور، کلید اتوماتیک و کلید مینیاتوری از برندهای معتبر.
                        </p>
                        <div className="flex items-start gap-2.5 text-sm bg-slate-800/50 dark:bg-muted border border-slate-700/50 dark:border-border rounded-lg p-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="leading-6 text-slate-300 dark:text-muted-foreground">{cfg.warrantyNote}</span>
                        </div>
                        {(cfg.telegram || cfg.instagram) && (
                            <div className="flex items-center gap-2 pt-1">
                                {cfg.telegram && (
                                    <a href={cfg.telegram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 dark:bg-muted hover:bg-primary hover:text-white flex items-center justify-center transition-colors" title="تلگرام">
                                        <Send className="w-4 h-4" />
                                    </a>
                                )}
                                {cfg.instagram && (
                                    <a href={cfg.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 dark:bg-muted hover:bg-primary hover:text-white flex items-center justify-center transition-colors" title="اینستاگرام">
                                        <Instagram className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* دسترسی سریع */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white dark:text-foreground border-r-4 border-primary pr-3">دسترسی سریع</h4>
                        <ul className="space-y-2 text-sm font-medium">
                            <li><Link href="/" className="hover:text-primary transition-colors">صفحه اصلی</Link></li>
                            <li><Link href="/products" className="hover:text-primary transition-colors">همه محصولات</Link></li>
                            <li><Link href="/category/contactor" className="hover:text-primary transition-colors">کنتاکتور</Link></li>
                            <li><Link href="/category/mccb" className="hover:text-primary transition-colors">کلید اتوماتیک</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">درباره ما</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">تماس با ما</Link></li>
                        </ul>
                    </div>

                    {/* اطلاعات فروشگاه */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white dark:text-foreground border-r-4 border-primary pr-3">اطلاعات فروشگاه</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary shrink-0" />
                                <span className="leading-6">{cfg.address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <a href={`tel:${cfg.phoneRaw}`} className="font-bold text-lg text-white dark:text-foreground hover:text-primary transition-colors" dir="ltr">{cfg.phoneDisplay}</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <MessageCircle className="w-5 h-5 text-primary shrink-0" />
                                <a href={`https://wa.me/${cfg.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">واتساپ (همین شماره)</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-primary shrink-0" />
                                <span>ساعت کاری: {cfg.hours}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-black/30 dark:bg-background/40 py-4 text-center text-xs text-slate-500 dark:text-muted-foreground border-t border-white/5 dark:border-border">
                <p>© {siteConfig.year} {siteConfig.brandGroup} — تمامی حقوق محفوظ است.</p>
            </div>
        </footer>
    )
}
