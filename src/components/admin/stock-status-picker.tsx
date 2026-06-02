"use client"

import { CheckCircle2, PhoneCall, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type StockStatus = "in_stock" | "call_for_price" | "out_of_stock"

const OPTIONS: {
    value: StockStatus
    label: string
    icon: typeof CheckCircle2
    activeClass: string
    iconClass: string
}[] = [
    {
        value: "in_stock",
        label: "موجود",
        icon: CheckCircle2,
        activeClass: "border-emerald-500 bg-emerald-500/10 ring-emerald-500/20",
        iconClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
        value: "call_for_price",
        label: "تماس بگیرید",
        icon: PhoneCall,
        activeClass: "border-amber-500 bg-amber-500/10 ring-amber-500/20",
        iconClass: "text-amber-600 dark:text-amber-400",
    },
    {
        value: "out_of_stock",
        label: "ناموجود",
        icon: XCircle,
        activeClass: "border-red-500 bg-red-500/10 ring-red-500/20",
        iconClass: "text-red-600 dark:text-red-400",
    },
]

interface Props {
    value: StockStatus
    onChange: (value: StockStatus) => void
}

export function StockStatusPicker({ value, onChange }: Props) {
    return (
        <div className="grid grid-cols-3 gap-2">
            {OPTIONS.map((opt) => {
                const active = value === opt.value
                return (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 py-3 px-2 text-xs font-bold transition-all outline-none",
                            active
                                ? `${opt.activeClass} ring-4 text-foreground`
                                : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40 hover:bg-accent",
                        )}
                    >
                        <opt.icon className={cn("w-5 h-5", active ? opt.iconClass : "text-muted-foreground")} />
                        {opt.label}
                    </button>
                )
            })}
        </div>
    )
}
