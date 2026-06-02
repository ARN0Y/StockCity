import { LayoutGrid } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="space-y-6">
            <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-muted-foreground" />
                    <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-6 w-20" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="bg-card rounded-xl border border-border overflow-hidden h-[320px]">
                        <div className="w-full h-48 bg-muted animate-pulse" />
                        <div className="p-4 space-y-3">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
