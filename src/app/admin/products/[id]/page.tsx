import { listBrands, listCategories, getProductById } from "@/lib/db"
import { ProductForm } from "@/components/admin/product-form"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const isNew = id === "new"

    let product = null
    if (!isNew) {
        const data = getProductById(id)
        if (!data) notFound()
        product = data
    }

    const brands = listBrands().map((b) => ({ id: b.id, name: b.name }))
    const categories = listCategories().map((c) => ({ id: c.id, name: c.name }))

    return <ProductForm initialData={product} brands={brands} categories={categories} />
}
