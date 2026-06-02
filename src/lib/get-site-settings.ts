// تنظیمات زنده‌ی سایت: مقادیر دیتابیس روی پیش‌فرض‌های siteConfig سوار می‌شوند.
// این فایل فقط سمت سرور استفاده می‌شود (به db وابسته است).

import { getSettings } from "@/lib/db"
import { siteConfig } from "@/lib/site-config"

export interface SiteSettings {
    nameFa: string
    phoneDisplay: string
    phoneRaw: string
    whatsapp: string
    address: string
    addressShort: string
    hours: string
    warrantyBrand: string
    warrantyNote: string
    instagram: string
    telegram: string
    // نوار اعلان بالای سایت
    announcementEnabled: boolean
    announcementText: string
    announcementLink: string
}

export function getSiteSettings(): SiteSettings {
    const s = getSettings()

    const val = (key: string, fallback: string) => (s[key]?.trim() ? s[key] : fallback)

    return {
        nameFa: val("nameFa", siteConfig.nameFa),
        phoneDisplay: val("phoneDisplay", siteConfig.phoneDisplay),
        phoneRaw: val("phoneRaw", siteConfig.phoneRaw),
        whatsapp: val("whatsapp", siteConfig.whatsapp),
        address: val("address", siteConfig.address),
        addressShort: val("addressShort", siteConfig.addressShort),
        hours: val("hours", siteConfig.hours),
        warrantyBrand: val("warrantyBrand", siteConfig.warrantyBrand),
        warrantyNote: val("warrantyNote", siteConfig.warrantyNote),
        instagram: s["instagram"] ?? "",
        telegram: s["telegram"] ?? "",
        announcementEnabled: s["announcementEnabled"] === "1",
        announcementText: s["announcementText"] ?? "",
        announcementLink: s["announcementLink"] ?? "",
    }
}
