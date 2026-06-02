import { NextResponse, type NextRequest } from "next/server"
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth"

export async function middleware(request: NextRequest) {
    const token = request.cookies.get(AUTH_COOKIE)?.value
    const session = await verifySessionToken(token)

    const url = request.nextUrl.clone()
    const isLoginPage = url.pathname === "/login"
    const isAdminPage = url.pathname.startsWith("/admin")

    // کاربر وارد شده ولی به صفحه ورود می‌رود → داشبورد
    if (isLoginPage && session) {
        url.pathname = "/admin/dashboard"
        return NextResponse.redirect(url)
    }

    // کاربر وارد نشده ولی سراغ پنل می‌رود → صفحه ورود
    if (isAdminPage && !session) {
        url.pathname = "/login"
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*", "/login"],
}
