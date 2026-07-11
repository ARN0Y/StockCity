"use client"

import Link from "next/link"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Menu, Phone, MessageCircle, Loader2, X, Home, Package, Info, MapPin, LayoutDashboard, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { siteConfig } from "@/lib/site-config"

export interface HeaderContact {
    nameFa: string
    phoneDisplay: string
    phoneRaw: string
    whatsapp: string
    addressShort: string
    warrantyBrand: string
}

export interface NavCategory {
    name: string
    slug: string
}

const FALLBACK_CONTACT: HeaderContact = {
    nameFa: siteConfig.nameFa,
    phoneDisplay: siteConfig.phoneDisplay,
    phoneRaw: siteConfig.phoneRaw,
    whatsapp: siteConfig.whatsapp,
    addressShort: siteConfig.addressShort,
    warrantyBrand: siteConfig.warrantyBrand,
}

export function Header({
    contact,
    categories = [],
    isLoggedIn = false,
}: {
    contact?: HeaderContact
    categories?: NavCategory[]
    isLoggedIn?: boolean
}) {
    const cfg = contact ?? FALLBACK_CONTACT
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [query, setQuery] = useState(searchParams.get("q") || "")
    const [isSearching, setIsSearching] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const urlQuery = searchParams.get("q") || ""
        setQuery((prev) => (prev === urlQuery ? prev : urlQuery))
    }, [searchParams])

    const performSearch = useCallback(
        (value: string) => {
            const trimmed = value.trim()
            if (trimmed) router.push(`/products?q=${encodeURIComponent(trimmed)}`)
            else if (pathname === "/products") router.push("/products")
            setIsSearching(false)
        },
        [router, pathname],
    )

    const handleSearchChange = useCallback(
        (value: string) => {
            setQuery(value)
            setIsSearching(true)
            if (timerRef.current) clearTimeout(timerRef.current)
            timerRef.current = setTimeout(() => performSearch(value), 600)
        },
        [performSearch],
    )

    useEffect(() => () => {
        if (timerRef.current) clearTimeout(timerRef.current)
    }, [])

    const clearSearch = useCallback(() => {
        setQuery("")
        setIsSearching(false)
        if (timerRef.current) clearTimeout(timerRef.current)
        if (pathname === "/products") router.push("/products")
    }, [router, pathname])

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault()
                if (timerRef.current) clearTimeout(timerRef.current)
                setIsSearching(false)
                performSearch(query)
            }
        },
        [query, performSearch],
    )

    const searchField = (placeholder: string) => (
        <div className="relative w-full">
            <input
                type="text"
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full h-11 pr-12 pl-10 rounded-lg bg-muted border-2 border-transparent focus:bg-background focus:border-primary focus:ring-0 transition-all outline-none text-sm font-medium text-foreground"
            />
            <div className="absolute top-0 right-0 h-11 w-12 flex items-center justify-center pointer-events-none text-muted-foreground">
                {isSearching ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <Search className="h-5 w-5" />}
            </div>
            {query && (
                <button
                    onClick={clearSearch}
                    type="button"
                    className="absolute top-0 left-0 h-11 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    )

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
            
            <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 hidden md:block dark:bg-card dark:border-b dark:border-border">
                <div className="max-w-[1800px] mx-auto flex justify-between items-center px-4">
                    <div className="flex items-center gap-4">
                        <span>{siteConfig.tagline}</span>
                        {cfg.warrantyBrand && (
                            <>
                                <span className="w-px h-3 bg-slate-700" />
                                <span>گارانتی تعویض محصولات {cfg.warrantyBrand}</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {isLoggedIn && (
                            <>
                                <Link
                                    href="/admin/dashboard"
                                    className="flex items-center gap-1 text-primary hover:text-primary/80 font-bold transition-colors"
                                >
                                    <LayoutDashboard className="w-3 h-3" /> ورود به داشبورد
                                </Link>
                                <span className="w-px h-3 bg-slate-700" />
                            </>
                        )}
                        <span>{cfg.addressShort}</span>
                        <span className="w-px h-3 bg-slate-700" />
                        <a
                            href={`https://wa.me/${cfg.whatsapp}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-white transition-colors flex items-center gap-1"
                        >
                            <MessageCircle className="w-3 h-3" /> واتساپ
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-[1800px] mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-8">
                
                <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden shrink-0">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] p-0 flex flex-col">
                        <SheetTitle className="sr-only">منوی اصلی</SheetTitle>

                        <div className="flex items-center gap-2 px-5 h-16 border-b border-border">
                            <div className="bg-white rounded-lg p-1 ring-1 ring-border">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/logo.webp" alt={cfg.nameFa} className="h-8 w-8 object-contain" />
                            </div>
                            <span className="text-lg font-black text-foreground">
                                Stock<span className="text-primary">City</span>
                            </span>
                        </div>

                        <nav className="flex-1 overflow-y-auto py-3">
                            <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors">
                                <Home className="w-[18px] h-[18px] text-muted-foreground" /> صفحه اصلی
                            </Link>
                            <Link href="/products" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors">
                                <Package className="w-[18px] h-[18px] text-muted-foreground" /> همه محصولات
                            </Link>

                            {categories.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-border">
                                    <p className="px-5 py-2 text-[11px] font-bold text-muted-foreground uppercase">دسته‌بندی‌ها</p>
                                    {categories.map((c) => (
                                        <Link
                                            key={c.slug}
                                            href={`/category/${c.slug}`}
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                                            {c.name}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            <div className="mt-2 pt-2 border-t border-border">
                                <Link href="/about" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors">
                                    <Info className="w-[18px] h-[18px] text-muted-foreground" /> درباره ما
                                </Link>
                                <Link href="/repairs" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors">
                                    <Wrench className="w-[18px] h-[18px] text-muted-foreground" /> تعمیرات
                                </Link>
                                <Link href="/contact" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors">
                                    <MapPin className="w-[18px] h-[18px] text-muted-foreground" /> تماس با ما
                                </Link>
                            </div>
                        </nav>

                        <div className="p-4 border-t border-border space-y-3">
                            <Button asChild className="w-full font-bold">
                                <a href={`tel:${cfg.phoneRaw}`}>
                                    <Phone className="h-4 w-4 ml-2" /> {cfg.phoneDisplay}
                                </a>
                            </Button>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">حالت نمایش</span>
                                <ThemeToggle />
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                
                <Link href="/" className="flex items-center gap-2 shrink-0 group">
                    <div className="bg-white rounded-lg p-1 shadow-sm ring-1 ring-border transition-transform group-hover:scale-110">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo.webp" alt={cfg.nameFa} className="h-9 w-9 sm:h-10 sm:w-10 object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg sm:text-xl font-black tracking-tight text-foreground leading-none">
                            Stock<span className="text-primary">City</span>
                        </span>
                        <span className="hidden sm:block text-[10px] text-muted-foreground font-medium mt-0.5">
                            {cfg.nameFa} | تجهیزات برق صنعتی
                        </span>
                    </div>
                </Link>

                
                <div className="hidden md:flex flex-1 max-w-3xl relative mx-4">
                    {searchField("جستجو (مثال: کنتاکتور اشنایدر)...")}
                </div>

                
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <ThemeToggle className="hidden md:inline-flex" />
                    <div className="hidden lg:flex flex-col items-end">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">مشاوره و فروش</span>
                        <span className="text-lg font-black text-foreground leading-none" dir="ltr">
                            {cfg.phoneDisplay}
                        </span>
                    </div>
                    <Button asChild size="icon" className="h-10 w-10 sm:w-auto sm:px-6 rounded-lg bg-slate-900 hover:bg-primary text-white font-bold transition-all shadow-md dark:bg-primary dark:hover:bg-primary/90">
                        <a href={`tel:${cfg.phoneRaw}`}>
                            <Phone className="h-4 w-4 sm:ml-2" />
                            <span className="hidden sm:inline">تماس</span>
                        </a>
                    </Button>
                </div>
            </div>

            
            <div className="md:hidden border-t border-border bg-background px-4 py-2.5">
                {searchField("جستجوی محصول...")}
            </div>

            
            <div className="border-t border-border hidden md:block bg-background">
                <div className="max-w-[1800px] mx-auto px-4">
                    <nav className="flex items-center gap-6 text-sm font-bold h-11 text-foreground/80 overflow-x-auto">
                        <Link href="/products" className="text-primary hover:bg-primary/5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap">
                            مشاهده همه محصولات
                        </Link>
                        <span className="w-px h-4 bg-border" />
                        {categories.map((c) => (
                            <Link key={c.slug} href={`/category/${c.slug}`} className="hover:text-primary transition-colors whitespace-nowrap">
                                {c.name}
                            </Link>
                        ))}
                        <span className="w-px h-4 bg-border" />
                        <Link href="/about" className="hover:text-primary transition-colors whitespace-nowrap">درباره ما</Link>
                        <Link href="/repairs" className="hover:text-primary transition-colors whitespace-nowrap">تعمیرات</Link>
                        <Link href="/contact" className="hover:text-primary transition-colors whitespace-nowrap">تماس با ما</Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}
