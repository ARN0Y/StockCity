"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth"
import { allProductsForExport, importProducts, type ImportRow, type StockStatus } from "@/lib/db"
import { rowsToCsv, parseCsv } from "@/lib/csv"

async function assertAdmin() {
    const store = await cookies()
    const session = await verifySessionToken(store.get(AUTH_COOKIE)?.value)
    if (!session) throw new Error("دسترسی غیرمجاز")
}

// ترتیب ستون‌های فایل CSV
const HEADERS = [
    "عنوان",
    "کد فنی",
    "برند",
    "دسته‌بندی",
    "وضعیت موجودی",
    "تعداد موجودی",
    "مشخصات فنی",
    "ویژگی‌های کلیدی",
]

const STATUS_FA_TO_EN: Record<string, StockStatus> = {
    موجود: "in_stock",
    "تماس بگیرید": "call_for_price",
    استعلام: "call_for_price",
    ناموجود: "out_of_stock",
    in_stock: "in_stock",
    call_for_price: "call_for_price",
    out_of_stock: "out_of_stock",
}

const STATUS_EN_TO_FA: Record<StockStatus, string> = {
    in_stock: "موجود",
    call_for_price: "تماس بگیرید",
    out_of_stock: "ناموجود",
}

/** خروجی CSV از همه‌ی محصولات. */
export async function exportProductsCsv(): Promise<{ filename: string; content: string }> {
    await assertAdmin()
    const products = allProductsForExport()

    const rows = products.map((p) => [
        p.title,
        p.model_number,
        p.brand?.name ?? "",
        p.category?.name ?? "",
        STATUS_EN_TO_FA[p.stock_status] ?? "موجود",
        p.stock_quantity ?? "",
        // مشخصات: «کلید=مقدار | کلید=مقدار»
        Object.entries(p.specifications ?? {})
            .map(([k, v]) => `${k}=${v}`)
            .join(" | "),
        // ویژگی‌ها: «الف | ب | ج»
        (p.key_features ?? []).join(" | "),
    ])

    const content = rowsToCsv(HEADERS, rows)
    const date = new Date().toISOString().slice(0, 10)
    return { filename: `stockcity-products-${date}.csv`, content }
}

function parseSpecs(raw: string): Record<string, string> {
    const out: Record<string, string> = {}
    if (!raw?.trim()) return out
    for (const part of raw.split("|")) {
        const idx = part.indexOf("=")
        if (idx > 0) {
            const k = part.slice(0, idx).trim()
            const v = part.slice(idx + 1).trim()
            if (k) out[k] = v
        }
    }
    return out
}

function parseFeatures(raw: string): string[] {
    if (!raw?.trim()) return []
    return raw
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean)
}

/** ورود گروهی محصولات از محتوای CSV. */
export async function importProductsCsv(
    csvText: string,
): Promise<{ success: boolean; created?: number; updated?: number; skipped?: number; errors?: string[]; error?: string }> {
    try {
        await assertAdmin()
        const table = parseCsv(csvText)
        if (table.length < 2) {
            return { success: false, error: "فایل خالی است یا فقط سرستون دارد." }
        }

        // سطر اول هدر است
        const dataRows = table.slice(1)

        const rows: ImportRow[] = dataRows.map((cols) => {
            const [title, model, brand, category, status, qty, specs, features] = cols
            const qtyNum = qty?.trim() ? parseInt(qty.replace(/[^0-9]/g, ""), 10) : null
            return {
                title: (title ?? "").trim(),
                model_number: (model ?? "").trim(),
                brandName: (brand ?? "").trim() || undefined,
                categoryName: (category ?? "").trim() || undefined,
                stock_status: STATUS_FA_TO_EN[(status ?? "").trim()] ?? "in_stock",
                stock_quantity: Number.isFinite(qtyNum as number) ? qtyNum : null,
                specifications: parseSpecs(specs ?? ""),
                key_features: parseFeatures(features ?? ""),
            }
        })

        const result = importProducts(rows)
        revalidatePath("/admin/products")
        revalidatePath("/")
        return {
            success: true,
            created: result.created,
            updated: result.updated,
            skipped: result.skipped,
            errors: result.errors,
        }
    } catch (e: any) {
        return { success: false, error: e?.message ?? "خطا در پردازش فایل" }
    }
}
