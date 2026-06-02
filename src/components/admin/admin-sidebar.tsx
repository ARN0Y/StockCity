"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
    LayoutDashboard,
    Package,
    PlusCircle,
    FolderTree,
    Settings,
    ExternalLink,
    Zap,
    Menu,
    X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"
import { LogoutButton } from "@/components/admin/logout-button"
import { ThemeToggle, ThemeToggleRow } from "@/components/theme-toggle"

const nav = [
    { href: "/admin/dashboard", label: "داشبورد", icon: LayoutDashboard },
    { href: "/admin/products", label: "محصولات", icon: Package },
    { href: "/admin/products/new", label: "افزودن محصول", icon: PlusCircle },
    { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: FolderTree },
    { href: "/admin/settings", label: "تنظیمات سایت", icon: Settings },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname()
    return (
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {nav.map((item) => {
                const active =
                    item.href === "/admin/products"
                        ? pathname === "/admin/products"
                        : pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                            "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                            active
                                ? "bg-foreground text-background shadow-sm"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                    >
                        <item.icon
                            className={cn(
                                "w-[18px] h-[18px] transition-colors",
                                active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                            )}
                        />
                        {item.label}
                    </Link>
                )
            })}

            <div className="pt-3 mt-3 border-t border-border">
                <Link
                    href="/"
                    target="_blank"
                    onClick={onNavigate}
                    className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                >
                    <ExternalLink className="w-[18px] h-[18px]" />
                    مشاهده سایت
                </Link>
            </div>
        </nav>
    )
}

function Brand() {
    return (
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-border">
            <div className="bg-foreground p-2 rounded-xl">
                <Zap className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col leading-none">
                <span className="font-black text-foreground text-[15px] tracking-tight">
                    Stock<span className="text-primary">City</span>
                </span>
                <span className="text-[10px] text-muted-foreground mt-1">پنل مدیریت {siteConfig.nameFa}</span>
            </div>
        </div>
    )
}

export function AdminSidebar() {
    const [open, setOpen] = useState(false)

    return (
        <>
            {/* دسکتاپ */}
            <aside className="hidden lg:flex fixed inset-y-0 right-0 z-30 w-64 flex-col bg-card border-l border-border">
                <Brand />
                <NavLinks />
                <div className="p-3 border-t border-border space-y-1">
                    <ThemeToggleRow />
                    <LogoutButton />
                </div>
            </aside>

            {/* موبایل: هدر */}
            <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-card border-b border-border">
                <div className="flex items-center gap-2">
                    <div className="bg-foreground p-1.5 rounded-lg">
                        <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-black text-foreground text-sm">StockCity Admin</span>
                </div>
                <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <button
                        onClick={() => setOpen(true)}
                        className="p-2 rounded-lg hover:bg-accent text-muted-foreground"
                        aria-label="منو"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* موبایل: کشو */}
            {open && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/40 animate-in fade-in" onClick={() => setOpen(false)} />
                    <div className="absolute inset-y-0 right-0 w-72 bg-card flex flex-col animate-in slide-in-from-right duration-200">
                        <div className="flex items-center justify-between">
                            <Brand />
                            <button onClick={() => setOpen(false)} className="p-2 mr-2 rounded-lg hover:bg-accent">
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>
                        <NavLinks onNavigate={() => setOpen(false)} />
                        <div className="p-3 border-t border-border">
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
