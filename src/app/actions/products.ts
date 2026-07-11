"use server"

import { revalidatePath } from "next/cache"
import {
    listProducts,
    getProductById,
    deleteProductById,
    createProduct,
    updateProduct,
    type ProductFilters,
    type StockStatus,
} from "@/lib/db"
import { deleteImageFiles } from "@/lib/image"

const PER_PAGE = 12

function revalidateEverything() {
    revalidatePath("/", "layout")
    revalidatePath("/admin/products")
}

export async function getProducts(page: number, filters?: ProductFilters) {
    const { data, total } = listProducts(page, PER_PAGE, filters ?? {})
    return { data, total, page, perPage: PER_PAGE }
}

export async function deleteProduct(id: string) {
    try {
        const product = getProductById(id)
        if (product?.images?.length) {
            await Promise.allSettled(product.images.map((url) => deleteImageFiles(url)))
        }
        deleteProductById(id)
        revalidateEverything()
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e?.message ?? "خطا در حذف محصول" }
    }
}

export interface SaveProductPayload {
    title: string
    model_number: string
    description?: string | null
    brand_id?: string | null
    category_id?: string | null
    stock_status?: StockStatus
    stock_quantity?: number | null
    price?: number | null
    specifications?: Record<string, string>
    key_features?: string[]
    images?: string[]
}

export async function saveProduct(payload: SaveProductPayload, id?: string) {
    try {
        if (id) {
            updateProduct(id, payload)
        } else {
            createProduct(payload)
        }
        revalidateEverything()
        return { success: true }
    } catch (e: any) {
        const msg: string = e?.message ?? "خطا در ذخیره محصول"
        if (msg.includes("UNIQUE") && msg.includes("model_number")) {
            return { success: false, error: "این کد فنی قبلاً ثبت شده است." }
        }
        return { success: false, error: msg }
    }
}
