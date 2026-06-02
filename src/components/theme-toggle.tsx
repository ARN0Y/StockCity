"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, toggle } = useTheme()

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "روشن کردن تم" : "تاریک کردن تم"}
            className={cn(
                "relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                className,
            )}
        >
            <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
    )
}

export function ThemeToggleRow() {
    const { theme, toggle } = useTheme()

    return (
        <button
            type="button"
            onClick={toggle}
            className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
        >
            {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            {theme === "dark" ? "حالت روشن" : "حالت تاریک"}
        </button>
    )
}
