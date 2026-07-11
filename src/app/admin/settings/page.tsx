import { getSettings } from "@/lib/db"
import { siteConfig } from "@/lib/site-config"
import { SettingsForm } from "@/components/admin/settings-form"

export const dynamic = "force-dynamic"

export default function AdminSettingsPage() {
    const saved = getSettings()

    const initial: Record<string, string> = {
        nameFa: saved.nameFa ?? siteConfig.nameFa,
        phoneDisplay: saved.phoneDisplay ?? siteConfig.phoneDisplay,
        phoneRaw: saved.phoneRaw ?? siteConfig.phoneRaw,
        whatsapp: saved.whatsapp ?? siteConfig.whatsapp,
        address: saved.address ?? siteConfig.address,
        addressShort: saved.addressShort ?? siteConfig.addressShort,
        hours: saved.hours ?? siteConfig.hours,
        warrantyBrand: saved.warrantyBrand ?? siteConfig.warrantyBrand,
        warrantyNote: saved.warrantyNote ?? siteConfig.warrantyNote,
        telegram: saved.telegram ?? "",
        instagram: saved.instagram ?? "",
        announcementEnabled: saved.announcementEnabled ?? "0",
        announcementText: saved.announcementText ?? "",
        announcementLink: saved.announcementLink ?? "",
        repairImage1: saved.repairImage1 ?? "",
        repairImage2: saved.repairImage2 ?? "",
        repairImage3: saved.repairImage3 ?? "",
        repairImage4: saved.repairImage4 ?? "",
        aboutText: saved.aboutText ?? "",
    }

    return <SettingsForm initial={initial} />
}
