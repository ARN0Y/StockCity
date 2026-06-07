"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, Eye, CheckCircle2, PhoneCall, XCircle } from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type ProductColumn = {
    id: string
    title: string
    model_number: string
    brand: string
    category: string
    stock_status: string
    created_at: string
    updated_at: string
}

const statusMap: Record<string, { label: string; className: string; icon: typeof CheckCircle2 }> = {
    in_stock: {
        label: "موجود",
        className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        icon: CheckCircle2,
    },
    call_for_price: {
        label: "استعلام",
        className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        icon: PhoneCall,
    },
    out_of_stock: {
        label: "ناموجود",
        className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
        icon: XCircle,
    },
}

function faDate(iso: string): string {
    if (!iso) return "—"
    try {
        return new Intl.DateTimeFormat("fa-IR", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(new Date(iso))
    } catch {
        return "—"
    }
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="px-2 -mr-2"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                نام محصول
                <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="max-w-[280px]">
                <p className="font-medium text-sm truncate text-foreground">{row.getValue("title")}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                    {row.original.brand !== "—" ? row.original.brand : ""}
                    {row.original.brand !== "—" && row.original.category !== "—" ? " · " : ""}
                    {row.original.category !== "—" ? row.original.category : ""}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "model_number",
        header: "کد فنی",
        cell: ({ row }) => (
            <code className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md font-mono">
                {row.getValue("model_number")}
            </code>
        ),
    },
    {
        accessorKey: "brand",
        header: "برند",
        filterFn: (row, id, filterValue) => {
            if (!filterValue || !Array.isArray(filterValue) || filterValue.length === 0) return true
            return filterValue.includes(row.getValue(id))
        },
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("brand")}</span>,
    },
    {
        accessorKey: "category",
        header: "دسته‌بندی",
        filterFn: (row, id, filterValue) => {
            if (!filterValue || !Array.isArray(filterValue) || filterValue.length === 0) return true
            return filterValue.includes(row.getValue(id))
        },
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("category")}</span>,
    },
    {
        accessorKey: "stock_status",
        header: "وضعیت",
        cell: ({ row }) => {
            const status = statusMap[row.getValue("stock_status") as string] || statusMap.out_of_stock
            const Icon = status.icon
            return (
                <Badge variant="outline" className={`gap-1 ${status.className}`}>
                    <Icon className="w-3 h-3" />
                    {status.label}
                </Badge>
            )
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="px-2"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                تاریخ افزودن
                <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
            </Button>
        ),
        cell: ({ row }) => (
            <span className="text-xs text-muted-foreground whitespace-nowrap">{faDate(row.getValue("created_at"))}</span>
        ),
    },
    {
        accessorKey: "updated_at",
        header: "آخرین ویرایش",
        cell: ({ row }) => (
            <span className="text-xs text-muted-foreground whitespace-nowrap">{faDate(row.getValue("updated_at"))}</span>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original
            return (
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild>
                            <Link href={`/product/${product.model_number}`} target="_blank">
                                <Eye className="mr-2 h-3.5 w-3.5" /> مشاهده
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}`}>
                                <Pencil className="mr-2 h-3.5 w-3.5" /> ویرایش
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={() => {
                                if (confirm("آیا از حذف این محصول مطمئنید؟")) {
                                    import("@/app/actions/products").then(({ deleteProduct }) => {
                                        deleteProduct(product.id).then(() => window.location.reload())
                                    })
                                }
                            }}
                        >
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> حذف
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
