import { listCategoriesWithCounts } from "@/lib/db"
import { CategoryManager } from "@/components/admin/category-manager"

export const dynamic = "force-dynamic"

export default function AdminCategoriesPage() {
    const categories = listCategoriesWithCounts().map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        product_count: c.product_count,
    }))

    return <CategoryManager categories={categories} />
}
