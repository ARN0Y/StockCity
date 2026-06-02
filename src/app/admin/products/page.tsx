import Link from "next/link"
import { listProducts } from "@/lib/db"
import { DataTable } from "./data-table"
import { columns, type ProductColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { ImportExport } from "@/components/admin/import-export"
import { Plus } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
    const { data: products } = listProducts(1, 100000, { sort: "newest" })

    const tableData: ProductColumn[] = products.map((p) => ({
        id: p.id,
        title: p.title,
        model_number: p.model_number,
        stock_status: p.stock_status,
        brand: p.brand?.name || "—",
        category: p.category?.name || "—",
        created_at: p.created_at,
        updated_at: p.updated_at,
    }))

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-foreground">محصولات</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        مدیریت و ویرایش محصولات ({tableData.length} محصول)
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <ImportExport />
                    <Button asChild className="h-9 gap-1.5 font-bold">
                        <Link href="/admin/products/new">
                            <Plus className="h-4 w-4" /> محصول جدید
                        </Link>
                    </Button>
                </div>
            </div>

            <DataTable columns={columns} data={tableData} />
        </div>
    )
}
