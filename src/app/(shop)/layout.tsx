import { cookies } from "next/headers"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Footer } from "@/components/layout/footer"
import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { listCategories, listBrandsWithCounts } from "@/lib/db"
import { getSiteSettings } from "@/lib/get-site-settings"
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
    const categories = listCategories()
    const brands = listBrandsWithCounts()
        .filter((b) => b.product_count > 0)
        .map((b) => ({ name: b.name, slug: b.slug }))
    const s = getSiteSettings()
    const isLoggedIn = !!(await verifySessionToken((await cookies()).get(AUTH_COOKIE)?.value))

    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            {s.announcementEnabled && (
                <AnnouncementBar text={s.announcementText} link={s.announcementLink || undefined} />
            )}

            <Header
                isLoggedIn={isLoggedIn}
                categories={categories.map((c) => ({ name: c.name, slug: c.slug }))}
                contact={{
                    nameFa: s.nameFa,
                    phoneDisplay: s.phoneDisplay,
                    phoneRaw: s.phoneRaw,
                    whatsapp: s.whatsapp,
                    addressShort: s.addressShort,
                    warrantyBrand: s.warrantyBrand,
                }}
            />

            <div className="flex-1 w-full max-w-[1800px] mx-auto flex items-start gap-6 px-4 py-6">
                <aside className="hidden lg:block w-[260px] shrink-0 sticky top-36">
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <Sidebar categories={categories as any} brands={brands} />
                    </div>
                </aside>

                <main className="flex-1 w-full min-w-0">{children}</main>
            </div>

            <Footer
                contact={{
                    nameFa: s.nameFa,
                    address: s.address,
                    phoneDisplay: s.phoneDisplay,
                    phoneRaw: s.phoneRaw,
                    whatsapp: s.whatsapp,
                    hours: s.hours,
                    warrantyNote: s.warrantyNote,
                    telegram: s.telegram,
                    instagram: s.instagram,
                }}
            />
        </div>
    )
}
