"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
    AUTH_COOKIE,
    checkCredentials,
    cookieOptions,
    createSessionToken,
} from "@/lib/auth"

export async function loginAction(
    _prevState: { error?: string } | undefined,
    formData: FormData,
): Promise<{ error?: string }> {
    const username = String(formData.get("username") || "")
    const password = String(formData.get("password") || "")

    if (!username || !password) {
        return { error: "نام کاربری و رمز عبور را وارد کنید." }
    }

    if (!checkCredentials(username, password)) {
        return { error: "نام کاربری یا رمز عبور اشتباه است." }
    }

    const token = await createSessionToken(username.trim())
    const store = await cookies()
    store.set(AUTH_COOKIE, token, cookieOptions)

    redirect("/admin/dashboard")
}

export async function logoutAction() {
    const store = await cookies()
    store.delete(AUTH_COOKIE)
    redirect("/login")
}
