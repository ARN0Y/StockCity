"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth"
import { setSettings } from "@/lib/db"

async function assertAdmin() {
    const store = await cookies()
    const session = await verifySessionToken(store.get(AUTH_COOKIE)?.value)
    if (!session) throw new Error("دسترسی غیرمجاز")
}

export async function saveSiteSettings(
    values: Record<string, string>,
): Promise<{ success: boolean; error?: string }> {
    try {
        await assertAdmin()
        setSettings(values)
        // همه‌ی صفحات سایت (که هدر/فوتر مشترک دارند) تازه‌سازی شوند
        revalidatePath("/", "layout")
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e?.message ?? "خطا در ذخیره تنظیمات" }
    }
}
