import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ["better-sqlite3", "sharp"],
    experimental: {
        serverActions: {
            bodySizeLimit: "16mb",
        },
    },
    images: {
        // تصاویر محصولات از قبل با Sharp به WebP بهینه شده‌اند، پس بهینه‌سازی دوباره‌ی
        // Next لازم نیست و فقط روی سرورهای با شبکه‌ی محدود مشکل ایجاد می‌کند. فایل‌ها
        // مستقیم از public/products سرو می‌شوند.
        unoptimized: true,
        remotePatterns: [{ protocol: "https", hostname: "**" }],
    },
    reactCompiler: true,
};

export default nextConfig;
