import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site-config"
import { allProductsForExport, listCategories } from "@/lib/db"

export const dynamic = "force-dynamic"

export default function sitemap(): MetadataRoute.Sitemap {
    const base = siteConfig.url.replace(/\/$/, "")

    const staticPages: MetadataRoute.Sitemap = [
        { url: `${base}/`, changeFrequency: "daily", priority: 1 },
        { url: `${base}/products`, changeFrequency: "daily", priority: 0.9 },
        { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
        { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.6 },
    ]

    const categoryPages: MetadataRoute.Sitemap = listCategories().map((c) => ({
        url: `${base}/category/${c.slug}`,
        changeFrequency: "weekly",
        priority: 0.7,
    }))

    const productPages: MetadataRoute.Sitemap = allProductsForExport().map((p) => ({
        url: `${base}/product/${encodeURIComponent(p.model_number)}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
        changeFrequency: "weekly",
        priority: 0.8,
    }))

    return [...staticPages, ...categoryPages, ...productPages]
}
