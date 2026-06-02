// ماژول بهینه‌سازی تصویر سمت سرور با Sharp.
// هر تصویر آپلودشده:
//   - چرخش خودکار بر اساس EXIF
//   - تغییر اندازه تا حداکثر عرض/ارتفاع مشخص (بدون بزرگ‌نمایی)
//   - تبدیل به WebP با کیفیت بهینه (حجم کم، لود سریع)
//   - ساخت یک نسخه‌ی بندانگشتی (thumbnail) برای کارت محصول
// فایل‌ها در public/products ذخیره می‌شوند و مسیر عمومی برگردانده می‌شود.

import type { Sharp } from "sharp"
import { randomUUID } from "crypto"
import path from "path"
import fs from "fs/promises"

// sharp به‌صورت تنبل بارگذاری می‌شود تا در گراف ماژول باندلر قرار نگیرد.
let _sharp: ((input?: Buffer | Uint8Array, opts?: any) => Sharp) | null = null
async function getSharp() {
    if (!_sharp) {
        const mod = await import("sharp")
        _sharp = (mod.default ?? mod) as any
    }
    return _sharp!
}

const PRODUCTS_DIR = path.join(process.cwd(), "public", "products")

const MAX_DIMENSION = 1400 // حداکثر بعد تصویر اصلی
const THUMB_DIMENSION = 480 // بعد تصویر بندانگشتی
const QUALITY = 80

async function ensureDir() {
    await fs.mkdir(PRODUCTS_DIR, { recursive: true })
}

export interface OptimizedImage {
    /** مسیر عمومی تصویر اصلی، مثل /products/ab12.webp */
    url: string
    /** مسیر عمومی تصویر بندانگشتی، مثل /products/ab12_thumb.webp */
    thumbUrl: string
    width: number
    height: number
    bytes: number
}

/**
 * یک فایل تصویر را بهینه و ذخیره می‌کند.
 * @param input بافر یا آرایه‌بایت تصویر ورودی
 */
export async function optimizeAndSaveImage(input: Buffer | Uint8Array): Promise<OptimizedImage> {
    await ensureDir()

    const id = randomUUID().slice(0, 12)
    const baseName = `${id}.webp`
    const thumbName = `${id}_thumb.webp`
    const mainPath = path.join(PRODUCTS_DIR, baseName)
    const thumbPath = path.join(PRODUCTS_DIR, thumbName)

    const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input)
    const sharp = await getSharp()

    // تصویر اصلی
    const pipeline = sharp(buffer, { failOn: "none" }).rotate()
    const meta = await pipeline.metadata()

    const mainInfo = await pipeline
        .resize(MAX_DIMENSION, MAX_DIMENSION, {
            fit: "inside",
            withoutEnlargement: true,
        })
        .webp({ quality: QUALITY, effort: 4 })
        .toFile(mainPath)

    // تصویر بندانگشتی (روی سفید برای ظاهر تمیز کاتالوگ)
    await sharp(buffer, { failOn: "none" })
        .rotate()
        .resize(THUMB_DIMENSION, THUMB_DIMENSION, {
            fit: "inside",
            withoutEnlargement: true,
        })
        .webp({ quality: 72, effort: 4 })
        .toFile(thumbPath)

    return {
        url: `/products/${baseName}`,
        thumbUrl: `/products/${thumbName}`,
        width: mainInfo.width,
        height: mainInfo.height,
        bytes: mainInfo.size,
        // meta فقط برای استفاده‌ی آینده
        ...(meta ? {} : {}),
    }
}

/**
 * حذف فایل تصویر و نسخه‌ی بندانگشتی متناظرش از دیسک.
 * فقط فایل‌های داخل public/products را حذف می‌کند (ایمن).
 */
export async function deleteImageFiles(publicUrl: string): Promise<void> {
    if (!publicUrl || !publicUrl.startsWith("/products/")) return
    const fileName = path.basename(publicUrl)
    if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) return

    const mainPath = path.join(PRODUCTS_DIR, fileName)

    // نسخه‌ی بندانگشتی متناظر (xxx.webp -> xxx_thumb.webp)
    const thumbName = fileName.replace(/(\.[a-z0-9]+)$/i, "_thumb$1")
    const thumbPath = path.join(PRODUCTS_DIR, thumbName)

    await Promise.allSettled([
        fs.unlink(mainPath),
        thumbName !== fileName ? fs.unlink(thumbPath) : Promise.resolve(),
    ])
}

/** آدرس نسخه‌ی بندانگشتی را از روی آدرس اصلی می‌سازد (بدون دسترسی به دیسک). */
export function toThumbUrl(url: string): string {
    if (!url || !url.startsWith("/products/")) return url
    return url.replace(/(\.[a-z0-9]+)(\?.*)?$/i, "_thumb$1")
}
