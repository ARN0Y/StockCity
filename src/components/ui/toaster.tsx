"use client"

import { useToast } from "@/hooks/use-toast"
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react"
import { useEffect, useState } from "react"

const ToastItem = ({ t, dismiss }: { t: any, dismiss: any }) => {
    const [isVisible, setIsVisible] = useState(false)
    const [isPaused, setIsPaused] = useState(false) // برای توقف تایمر وقتی موس روی پیام است

    // شروع انیمیشن ورود
    useEffect(() => {
        const animationFrame = requestAnimationFrame(() => {
            setIsVisible(true)
        })
        return () => cancelAnimationFrame(animationFrame)
    }, [])

    // مدیریت تایمر بسته شدن
    useEffect(() => {
        if (isPaused) return

        const timer = setTimeout(() => {
            handleDismiss()
        }, 5000) // ۵ ثانیه زمان نمایش

        return () => clearTimeout(timer)
    }, [isPaused])

    const handleDismiss = () => {
        setIsVisible(false) // اول انیمیشن خروج اجرا شود

        // صبر کن تا انیمیشن تمام شود (۳۰۰ میلی‌ثانیه) سپس از استیت حذف کن
        setTimeout(() => {
            dismiss(t.id)
        }, 300)
    }

    return (
        <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className={`
        pointer-events-auto relative w-full flex items-start gap-4 p-4 rounded-xl shadow-xl border 
        transition-all duration-500 ease-in-out transform
        ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
        ${t.variant === 'destructive'
                ? 'bg-white border-red-100 text-red-900'
                : 'bg-white border-emerald-100 text-slate-900'
            }
      `}
            style={{ direction: 'rtl' }}
        >
            {/* آیکون وضعیت */}
            <div className={`mt-0.5 p-2 rounded-full shrink-0 ${t.variant === 'destructive' ? 'bg-red-50' : 'bg-emerald-50'}`}>
                {t.variant === 'destructive'
                    ? <AlertCircle className="w-5 h-5 text-red-600" />
                    : <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                }
            </div>

            {/* متن پیام */}
            <div className="flex-1 pt-1.5">
                {t.title && <p className="font-bold text-sm leading-none mb-1.5">{t.title}</p>}
                {t.description && <p className="text-xs text-slate-500 leading-relaxed pl-4">{t.description}</p>}
            </div>

            {/* دکمه بستن */}
            <button
                onClick={handleDismiss}
                className="absolute top-3 left-3 text-slate-400 hover:text-slate-800 hover:bg-slate-100 p-1 rounded-md transition-colors cursor-pointer z-50"
            >
                <X className="w-4 h-4" />
            </button>

            {/* نوار تایمر (اختیاری - زیبایی) */}
            <div className={`absolute bottom-0 right-0 h-1 rounded-bl-xl rounded-br-xl transition-all duration-[5000ms] ease-linear ${isVisible && !isPaused ? 'w-full' : 'w-0'} ${t.variant === 'destructive' ? 'bg-red-200' : 'bg-emerald-200'}`} style={{ opacity: 0.5 }} />
        </div>
    )
}

export function Toaster() {
    const { toasts, dismiss } = useToast()

    return (
        // Z-Index بسیار بالا (9999) برای اطمینان از اینکه روی همه چیز است
        <div className="fixed top-6 left-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none p-4 md:p-0">
            {toasts.map((t) => (
                <ToastItem key={t.id} t={t} dismiss={dismiss} />
            ))}
        </div>
    )
}