"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Phone, Box, MessageCircle } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Product } from "@/types/collection"
import { siteConfig } from "@/lib/site-config"
import { formatToman } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProductCardProps {
    product: Product
}

function toThumb(url?: string) {
    if (!url) return url
    if (url.startsWith("/media/")) return url.replace(/(\.[a-z0-9]+)$/i, "_thumb$1")
    return url
}

export function ProductCard({ product }: ProductCardProps) {
    const [imageError, setImageError] = useState(false)
    const mainImage = toThumb(product.images?.[0])
    const priceLabel = formatToman(product.price)

    return (
        <Card className="group overflow-hidden border-border transition-all duration-300 hover:shadow-xl hover:border-primary/40 bg-card rounded-xl py-0 gap-0">
            <Link href={`/product/${product.model_number}`}>
                <CardContent className="p-0">
                    <div className="relative aspect-[4/3] bg-white flex items-center justify-center border-b border-border overflow-hidden p-4">
                        <div className="absolute top-3 right-3 z-10">
                            {product.stock_status === "in_stock" ? (
                                <Badge className="bg-emerald-600/90 hover:bg-emerald-700 text-white text-[10px] px-2 h-5">موجود</Badge>
                            ) : (
                                <Badge variant="secondary" className="text-[10px] px-2 h-5">استعلام</Badge>
                            )}
                        </div>

                        {!imageError && mainImage ? (
                            <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                                <Image
                                    src={mainImage}
                                    alt={product.title}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    className="object-contain"
                                    onError={() => setImageError(true)}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-muted-foreground/40 gap-2">
                                <Box className="w-10 h-10 stroke-1" />
                            </div>
                        )}
                    </div>

                    <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-medium">{product.brand?.name}</span>
                            <span className="font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                                {product.model_number}
                            </span>
                        </div>
                        <h3 className="font-bold text-sm leading-snug text-foreground line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
                            {product.title}
                        </h3>
                        {priceLabel ? (
                            <p className="text-sm font-black text-primary pt-0.5" dir="rtl">{priceLabel}</p>
                        ) : (
                            <p className="text-xs font-bold text-muted-foreground pt-0.5">تماس بگیرید</p>
                        )}
                    </div>
                </CardContent>
            </Link>

            <CardFooter className="p-3 bg-muted/40 border-t border-border grid grid-cols-3 gap-2">
                <Button className="col-span-2 h-9 text-xs font-bold hover:bg-primary hover:text-white hover:border-primary transition-colors" variant="outline" asChild>
                    <a href={`tel:${siteConfig.phoneRaw}`}>
                        <Phone className="h-3.5 w-3.5 ml-1.5" />
                        تماس
                    </a>
                </Button>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="icon" variant="outline" className="h-9 w-full text-emerald-600 border-emerald-500/30 hover:bg-emerald-600 hover:text-white" asChild>
                                <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer" aria-label="واتساپ">
                                    <MessageCircle className="h-4 w-4" />
                                </a>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>واتساپ</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardFooter>
        </Card>
    )
}
