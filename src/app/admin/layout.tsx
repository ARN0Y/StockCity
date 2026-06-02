import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const store = await cookies()
    const session = await verifySessionToken(store.get(AUTH_COOKIE)?.value)
    if (!session) redirect("/login")

    return (
        <div className="min-h-screen bg-background text-foreground" dir="rtl">
            <AdminSidebar />
            <main className="lg:mr-64 min-h-screen">
                <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
            </main>
        </div>
    )
}
