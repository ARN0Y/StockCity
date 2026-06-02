import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // ماژول‌های نیتیو نباید توسط باندلر سرور پردازش شوند.
    serverExternalPackages: ["better-sqlite3", "sharp"],
    experimental: {
        serverActions: {
            // اجازه‌ی آپلود تصاویر حجیم‌تر در سرور اکشن‌ها.
            bodySizeLimit: "16mb",
        },
    },
    images: {
        // تصاویر بهینه‌شده محلی از public/products سرو می‌شوند؛ لینک‌های خارجی هم مجازند.
        remotePatterns: [{ protocol: "https", hostname: "**" }],
    },
    reactCompiler: true,
};

export default nextConfig;
