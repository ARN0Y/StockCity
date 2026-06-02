import { cookies } from "next/headers"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { listCategories } from "@/lib/db"
import { getSiteSettings } from "@/lib/get-site-settings"
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function ProductDetailLayout({ children }: { children: React.ReactNode }) {
    const s = getSiteSettings()
    const categories = listCategories().map((c) => ({ name: c.name, slug: c.slug }))
    const isLoggedIn = !!(await verifySessionToken((await cookies()).get(AUTH_COOKIE)?.value))

    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            {s.announcementEnabled && (
                <AnnouncementBar text={s.announcementText} link={s.announcementLink || undefined} />
            )}
            <Header
                isLoggedIn={isLoggedIn}
                categories={categories}
                contact={{
                    nameFa: s.nameFa,
                    phoneDisplay: s.phoneDisplay,
                    phoneRaw: s.phoneRaw,
                    whatsapp: s.whatsapp,
                    addressShort: s.addressShort,
                    warrantyBrand: s.warrantyBrand,
                }}
            />
            <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 py-8">{children}</main>
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
