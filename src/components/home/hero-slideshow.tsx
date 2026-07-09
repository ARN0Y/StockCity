"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Slide {
    src: string
    alt: string
    href: string
}

// عکس‌ها در public/slides/ قرار دارند. برای تغییر بنرها کافی است فایل‌ها را جایگزین کنید.
const SLIDES: Slide[] = [
    { src: "/slides/slide-1.jpg", alt: "فروش انواع اینورترهای صنعتی نو و استوک", href: "/products" },
    { src: "/slides/slide-2.jpg", alt: "فروش انواع کلیدهای اتوماتیک صنعتی استوک اروپایی", href: "/products" },
    { src: "/slides/slide-3.jpg", alt: "فروش انواع کنتاکتورهای صنعتی استوک اروپایی", href: "/products" },
    { src: "/slides/slide-4.jpg", alt: "تعمیرات تخصصی کلید هوایی، کلید اتوماتیک و کنتاکتور", href: "/repairs" },
    { src: "/slides/slide-5.jpg", alt: "تعمیرات تخصصی اینورترهای صنعتی تا رنج ۱۸۰۰ کیلووات", href: "/repairs" },
    { src: "/slides/slide-6.jpg", alt: "ساخت و طراحی انواع تیغه پلاتین کلید و کنتاکتور صنعتی", href: "/repairs" },
]

const INTERVAL = 5000

export function HeroSlideshow() {
    const [index, setIndex] = useState(0)
    const [paused, setPaused] = useState(false)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const goTo = useCallback((i: number) => {
        setIndex((i + SLIDES.length) % SLIDES.length)
    }, [])

    const next = useCallback(() => goTo(index + 1), [index, goTo])
    const prev = useCallback(() => goTo(index - 1), [index, goTo])

    useEffect(() => {
        if (paused) return
        timerRef.current = setInterval(() => {
            setIndex((i) => (i + 1) % SLIDES.length)
        }, INTERVAL)
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [paused])

    return (
        <section
            className="relative overflow-hidden rounded-3xl border border-border shadow-sm bg-muted/40 select-none"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription="carousel"
            aria-label="بنرهای فروشگاه"
        >
            <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-[21/9]">
                {SLIDES.map((slide, i) => (
                    <Link
                        key={slide.src}
                        href={slide.href}
                        tabIndex={i === index ? 0 : -1}
                        aria-hidden={i !== index}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                            i === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                        }`}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={slide.src}
                            alt={slide.alt}
                            loading={i === 0 ? "eager" : "lazy"}
                            className="h-full w-full object-cover"
                            draggable={false}
                        />
                    </Link>
                ))}
            </div>

            {/* دکمه‌های قبلی/بعدی (RTL) */}
            <button
                type="button"
                onClick={next}
                aria-label="بنر بعدی"
                className="absolute top-1/2 right-3 sm:right-4 -translate-y-1/2 z-20 h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-background/70 hover:bg-background text-foreground backdrop-blur border border-border shadow-md flex items-center justify-center transition-colors"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
            <button
                type="button"
                onClick={prev}
                aria-label="بنر قبلی"
                className="absolute top-1/2 left-3 sm:left-4 -translate-y-1/2 z-20 h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-background/70 hover:bg-background text-foreground backdrop-blur border border-border shadow-md flex items-center justify-center transition-colors"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            {/* نقطه‌ها */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`نمایش بنر ${i + 1}`}
                        aria-current={i === index}
                        className={`h-2.5 rounded-full transition-all ${
                            i === index ? "w-7 bg-primary" : "w-2.5 bg-background/70 hover:bg-background border border-border"
                        }`}
                    />
                ))}
            </div>
        </section>
    )
}
