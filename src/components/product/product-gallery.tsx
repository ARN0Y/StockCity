"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Share2, Maximize2, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
    images: string[]
    title: string
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
    const safeImages = images.length > 0 ? images : ["/placeholder.png"]

    const [selectedImage, setSelectedImage] = useState(safeImages[0])
    const [isZoomOpen, setIsZoomOpen] = useState(false)
    const [shared, setShared] = useState(false)

    const handleShare = useCallback(async () => {
        const url = typeof window !== "undefined" ? window.location.href : ""
        if (navigator.share) {
            try {
                await navigator.share({ title, url })
                return
            } catch {
            }
        }
        try {
            await navigator.clipboard.writeText(url)
            setShared(true)
            setTimeout(() => setShared(false), 2000)
        } catch {
        }
    }, [title])

    return (
        <>
            <div className="bg-white p-6 lg:p-8 border-b lg:border-b-0 lg:border-l border-border relative min-h-[360px] lg:min-h-[500px] flex flex-col justify-between h-full">

                
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={handleShare}
                        title="اشتراک‌گذاری محصول"
                        className={cn(
                            "h-9 w-9 rounded-lg bg-white border-slate-200 shadow-sm transition-colors",
                            shared ? "text-emerald-600 border-emerald-300" : "text-slate-500 hover:text-primary hover:border-primary/30",
                        )}
                    >
                        {shared ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                    </Button>
                    {shared && (
                        <span className="self-center text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md animate-in fade-in slide-in-from-left-1">
                            لینک کپی شد!
                        </span>
                    )}
                </div>

                
                <div
                    className="flex-1 flex items-center justify-center py-8 relative group cursor-zoom-in"
                    onClick={() => setIsZoomOpen(true)}
                >
                    <div className="relative w-full aspect-square max-w-[400px]">
                        <Image
                            src={selectedImage}
                            alt={title}
                            fill
                            className="object-contain transition-transform duration-500 ease-in-out group-hover:scale-105"
                            priority
                        />
                    </div>

                    
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-slate-900/90 text-white px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-2 text-xs shadow-lg">
                            <Maximize2 className="w-4 h-4" />
                            بزرگنمایی
                        </div>
                    </div>
                </div>

                
                {safeImages.length > 1 && (
                    <div className="flex gap-3 justify-center mt-4 overflow-x-auto p-2 scrollbar-hide select-none">
                        {safeImages.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImage(img)}
                                className={cn(
                                    "relative w-20 h-20 rounded-md flex items-center justify-center p-1 cursor-pointer transition-all bg-white shrink-0",
                                    selectedImage === img
                                        ? "ring-2 ring-primary ring-offset-2 z-10 shadow-sm scale-105"
                                        : "border border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100"
                                )}
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src={img}
                                        alt={`نمای ${i + 1}`}
                                        fill
                                        className="object-contain p-1"
                                    />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            
            {isZoomOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200"
                    onClick={() => setIsZoomOpen(false)}
                >
                    <button
                        onClick={() => setIsZoomOpen(false)}
                        className="absolute top-6 left-6 z-[110] p-2 bg-slate-100 hover:bg-red-100 text-slate-800 hover:text-red-600 rounded-full transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="relative w-[90vw] h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={selectedImage}
                            alt={title}
                            fill
                            className="object-contain"
                            quality={100}
                            priority
                        />
                    </div>

                    {safeImages.length > 1 && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 overflow-x-auto max-w-[90vw] p-4 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm border border-white/20" onClick={(e) => e.stopPropagation()}>
                            {safeImages.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(img)}
                                    className={cn(
                                        "relative w-16 h-16 rounded-md overflow-hidden transition-all border-2 bg-white",
                                        selectedImage === img
                                            ? "border-primary scale-110 shadow-lg ring-2 ring-white"
                                            : "border-transparent opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <Image src={img} alt="" fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}