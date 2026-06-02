"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth"
import {
    createCategory,
    updateCategory,
    deleteCategoryById,
    createBrand as dbCreateBrand,
} from "@/lib/db"

async function assertAdmin() {
    const store = await cookies()
    const session = await verifySessionToken(store.get(AUTH_COOKIE)?.value)
    if (!session) throw new Error("دسترسی غیرمجاز")
}

export interface CategoryActionResult {
    success: boolean
    error?: string
}

export async function addCategory(input: {
    name: string
    slug?: string
}): Promise<CategoryActionResult> {
    try {
        await assertAdmin()
        if (!input.name?.trim()) return { success: false, error: "نام دسته الزامی است." }
        createCategory({ name: input.name, slug: input.slug })
        revalidatePath("/admin/categories")
        revalidatePath("/", "layout")
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e?.message ?? "خطا در ایجاد دسته" }
    }
}

export async function editCategory(
    id: string,
    input: { name: string; slug?: string; sort_order?: number },
): Promise<CategoryActionResult> {
    try {
        await assertAdmin()
        if (!input.name?.trim()) return { success: false, error: "نام دسته الزامی است." }
        updateCategory(id, input)
        revalidatePath("/admin/categories")
        revalidatePath("/", "layout")
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e?.message ?? "خطا در ویرایش دسته" }
    }
}

export async function removeCategory(id: string): Promise<CategoryActionResult> {
    try {
        await assertAdmin()
        deleteCategoryById(id)
        revalidatePath("/admin/categories")
        revalidatePath("/", "layout")
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e?.message ?? "خطا در حذف دسته" }
    }
}

/** افزودن سریع برند از داخل فرم محصول. */
export async function quickAddBrand(
    name: string,
): Promise<{ success: boolean; id?: string; name?: string; error?: string }> {
    try {
        await assertAdmin()
        if (!name?.trim()) return { success: false, error: "نام برند الزامی است." }
        const b = dbCreateBrand(name)
        revalidatePath("/admin/products/new")
        return { success: true, id: b.id, name: b.name }
    } catch (e: any) {
        return { success: false, error: e?.message ?? "خطا در ایجاد برند" }
    }
}
