import type { Metadata } from "next"
import { Vazirmatn } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider, themeInitScript } from "@/components/theme-provider"
import { siteConfig } from "@/lib/site-config"
import "./globals.css"

const vazir = Vazirmatn({ subsets: ["arabic", "latin"] })

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: `${siteConfig.nameEn} | ${siteConfig.nameFa} — تجهیزات برق صنعتی`,
        template: `%s | ${siteConfig.nameEn}`,
    },
    description: siteConfig.description,
    keywords: [
        "کنتاکتور",
        "کلید اتوماتیک",
        "کلید مینیاتوری",
        "تجهیزات برق صنعتی",
        "اشنایدر",
        "زیمنس",
        "هیوندای",
        siteConfig.nameFa,
        siteConfig.nameEn,
    ],
    openGraph: {
        type: "website",
        siteName: siteConfig.nameEn,
        locale: "fa_IR",
        title: `${siteConfig.nameEn} | ${siteConfig.nameFa}`,
        description: siteConfig.description,
    },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="fa-IR" dir="rtl" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
            </head>
            <body className={`${vazir.className} min-h-screen bg-background text-foreground antialiased`}>
                <ThemeProvider>
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    )
}
