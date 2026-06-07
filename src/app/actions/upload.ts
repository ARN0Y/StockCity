"use server"

import { cookies } from "next/headers"
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth"
import { optimizeAndSaveImage, deleteImageFiles } from "@/lib/image"

const MAX_BYTES = 15 * 1024 * 1024
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]

async function assertAdmin() {
    const store = await cookies()
    const session = await verifySessionToken(store.get(AUTH_COOKIE)?.value)
    if (!session) throw new Error("دسترسی غیرمجاز")
}

export interface UploadResult {
    success: boolean
    url?: string
    thumbUrl?: string
    error?: string
}

export async function uploadProductImage(formData: FormData): Promise<UploadResult> {
    try {
        await assertAdmin()

        const file = formData.get("file")
        if (!(file instanceof File)) {
            return { success: false, error: "فایلی ارسال نشد." }
        }
        if (file.size > MAX_BYTES) {
            return { success: false, error: "حجم فایل بیش از ۱۵ مگابایت است." }
        }
        if (file.type && !ALLOWED.includes(file.type)) {
            return { success: false, error: "فرمت تصویر پشتیبانی نمی‌شود." }
        }

        const nameHint = String(formData.get("nameHint") || "")

        const bytes = new Uint8Array(await file.arrayBuffer())
        const result = await optimizeAndSaveImage(bytes, nameHint)

        return { success: true, url: result.url, thumbUrl: result.thumbUrl }
    } catch (e: any) {
        return { success: false, error: e?.message ?? "خطا در آپلود تصویر" }
    }
}

export async function removeProductImage(url: string): Promise<{ success: boolean }> {
    try {
        await assertAdmin()
        await deleteImageFiles(url)
        return { success: true }
    } catch {
        return { success: false }
    }
}
