export const siteConfig = {
    nameEn: "Stock City",
    nameFa: "استوک سیتی",
    brandGroup: "stockcitygrp",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://stockcity.ir",
    tagline: "تأمین تخصصی تجهیزات برق صنعتی و اتوماسیون",
    description:
        "استوک سیتی (Stock City) | فروش کنتاکتور، کلید اتوماتیک، کلید مینیاتوری و تجهیزات برق صنعتی در اصفهان، شهرک صنعتی دولت‌آباد.",

    phoneDisplay: "۰۹۱۳۴۸۹۱۳۸۰",
    phoneRaw: "09134891380",
    phoneIntl: "989134891380",
    whatsapp: "989134891380",

    address: "اصفهان، شهرک صنعتی دولت‌آباد، خیابان ۳۸",
    addressShort: "اصفهان، شهرک صنعتی دولت‌آباد",
    hours: "۹ صبح تا ۵ بعد از ظهر",
    hoursShort: "۹ تا ۱۷",

    warrantyBrand: "Patvaz",
    warrantyNote:
        "محصولات برند پاتواز (Patvaz) دارای گارانتی تعویض در صورت بروز هر مشکل هستند.",

    year: 1404,
} as const

export type SiteConfig = typeof siteConfig
