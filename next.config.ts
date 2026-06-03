import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ["better-sqlite3", "sharp"],
    experimental: {
        serverActions: {
            bodySizeLimit: "16mb",
            // پشت CDN/پراکسی، دامنه‌های مجاز برای Server Actions از env خوانده می‌شوند
            // تا ذخیره/آپلود/ورود پشت دامنه به خطای origin نخورد.
            allowedOrigins: process.env.ALLOWED_ORIGINS
                ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean)
                : undefined,
        },
    },
    images: {
        // تصاویر از قبل با Sharp بهینه شده‌اند و از مسیر /media سرو می‌شوند؛ بهینه‌سازی
        // دوباره‌ی Next لازم نیست و روی سرورهای با شبکه‌ی محدود مشکل ایجاد می‌کند.
        unoptimized: true,
        remotePatterns: [{ protocol: "https", hostname: "**" }],
    },
    reactCompiler: true,
};

export default nextConfig;
