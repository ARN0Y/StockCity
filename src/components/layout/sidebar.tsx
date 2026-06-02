"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Layers, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Category } from "@/types/collection"
import { Checkbox } from "@/components/ui/checkbox"

interface BrandOption {
    name: string
    slug: string
}

interface SidebarProps {
    categories: Category[]
    brands: BrandOption[]
}

export function Sidebar({ categories, brands }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleBrandChange = (brandSlug: string, checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString())
        if (checked) params.set("brand", brandSlug)
        else params.delete("brand")
        router.push(`/products?${params.toString()}`)
    }

    const renderCategories = (cats: Category[]) =>
        cats.map((category) => {
            const isActive = pathname === `/category/${category.slug}`
            const hasChildren = category.children && category.children.length > 0

            if (hasChildren) {
                return (
                    <AccordionItem key={category.id} value={category.id} className="border-b last:border-0 border-border">
                        <AccordionTrigger className="px-4 py-2.5 text-sm font-medium hover:text-primary text-foreground">
                            {category.name}
                        </AccordionTrigger>
                        <AccordionContent className="bg-muted/40 pb-0">
                            <div className="flex flex-col">{renderCategories(category.children!)}</div>
                        </AccordionContent>
                    </AccordionItem>
                )
            }

            return (
                <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className={cn(
                        "flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                        isActive ? "text-primary font-bold bg-primary/5" : "text-muted-foreground",
                    )}
                >
                    {category.name}
                </Link>
            )
        })

    return (
        <div className="w-full">
            <div>
                <div className="p-3 bg-muted/60 border-b border-border flex items-center gap-2">
                    <Layers className="w-4 h-4 text-muted-foreground" />
                    <span className="font-bold text-foreground text-sm">دسته‌بندی کالاها</span>
                </div>
                <Accordion type="multiple" className="w-full">
                    {categories.length === 0 ? (
                        <p className="text-xs text-muted-foreground p-4 text-center">دسته‌ای موجود نیست</p>
                    ) : (
                        renderCategories(categories)
                    )}
                </Accordion>
            </div>

            {brands.length > 0 && (
                <div className="border-t border-border">
                    <div className="p-3 bg-muted/60 border-b border-border flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <span className="font-bold text-foreground text-sm">برندهای موجود</span>
                    </div>
                    <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
                        {brands.map((brand) => {
                            const checked = searchParams.get("brand") === brand.slug
                            return (
                                <div key={brand.slug} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`brand-${brand.slug}`}
                                        checked={checked}
                                        onCheckedChange={(c) => handleBrandChange(brand.slug, c as boolean)}
                                    />
                                    <label
                                        htmlFor={`brand-${brand.slug}`}
                                        className="text-sm font-medium leading-none text-muted-foreground cursor-pointer"
                                    >
                                        {brand.name}
                                    </label>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
