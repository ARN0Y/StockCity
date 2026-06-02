import type { Sharp } from "sharp"
import { randomUUID } from "crypto"
import path from "path"
import fs from "fs/promises"

let _sharp: ((input?: Buffer | Uint8Array, opts?: any) => Sharp) | null = null
async function getSharp() {
    if (!_sharp) {
        const mod = await import("sharp")
        _sharp = (mod.default ?? mod) as any
    }
    return _sharp!
}

const PRODUCTS_DIR = path.join(process.cwd(), "public", "products")

const MAX_DIMENSION = 1400
const THUMB_DIMENSION = 480
const QUALITY = 80

async function ensureDir() {
    await fs.mkdir(PRODUCTS_DIR, { recursive: true })
}

export interface OptimizedImage {
    url: string
    thumbUrl: string
    width: number
    height: number
    bytes: number
}

/**
 * یک اسلاگ امن برای نام فایل از روی متن دلخواه (مثل عنوان محصول) می‌سازد.
 * حروف لاتین و عدد نگه داشته می‌شوند؛ فاصله و کاراکترهای دیگر به - تبدیل می‌شوند.
 * اگر متن لاتین معتبری نداشت (مثلاً کاملاً فارسی بود) رشته‌ی خالی برمی‌گرداند.
 */
export function fileSlug(input: string): string {
    return (input || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50)
}

/**
 * یک نام پایه‌ی یکتا برای فایل می‌سازد: اسلاگ + بخش کوتاه تصادفی برای جلوگیری از تداخل.
 */
function buildBaseName(hint?: string): string {
    const slug = fileSlug(hint || "")
    const rand = randomUUID().slice(0, 6)
    return slug ? `${slug}-${rand}` : `product-${rand}`
}

/**
 * یک فایل تصویر را بهینه و ذخیره می‌کند.
 * @param input بافر یا آرایه‌بایت تصویر ورودی
 * @param nameHint متن اختیاری برای نام‌گذاری فایل (مثل عنوان یا کد محصول)
 */
export async function optimizeAndSaveImage(
    input: Buffer | Uint8Array,
    nameHint?: string,
): Promise<OptimizedImage> {
    await ensureDir()

    const base = buildBaseName(nameHint)
    const baseName = `${base}.webp`
    const thumbName = `${base}_thumb.webp`
    const mainPath = path.join(PRODUCTS_DIR, baseName)
    const thumbPath = path.join(PRODUCTS_DIR, thumbName)

    const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input)
    const sharp = await getSharp()

    // هر خروجی از یک نمونه‌ی تازه‌ی sharp ساخته می‌شود تا پایپ‌لاین خراب/سفید نشود.
    const mainInfo = await sharp(buffer, { failOn: "none" })
        .rotate()
        .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 4 })
        .toFile(mainPath)

    await sharp(buffer, { failOn: "none" })
        .rotate()
        .resize(THUMB_DIMENSION, THUMB_DIMENSION, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 72, effort: 4 })
        .toFile(thumbPath)

    return {
        url: `/products/${baseName}`,
        thumbUrl: `/products/${thumbName}`,
        width: mainInfo.width,
        height: mainInfo.height,
        bytes: mainInfo.size,
    }
}

/**
 * حذف فایل تصویر و نسخه‌ی بندانگشتی متناظرش از دیسک.
 * فقط فایل‌های داخل public/products را حذف می‌کند.
 */
export async function deleteImageFiles(publicUrl: string): Promise<void> {
    if (!publicUrl || !publicUrl.startsWith("/products/")) return
    const fileName = path.basename(publicUrl)
    if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) return

    const mainPath = path.join(PRODUCTS_DIR, fileName)
    const thumbName = fileName.replace(/(\.[a-z0-9]+)$/i, "_thumb$1")
    const thumbPath = path.join(PRODUCTS_DIR, thumbName)

    await Promise.allSettled([
        fs.unlink(mainPath),
        thumbName !== fileName ? fs.unlink(thumbPath) : Promise.resolve(),
    ])
}

/** آدرس نسخه‌ی بندانگشتی را از روی آدرس اصلی می‌سازد. */
export function toThumbUrl(url: string): string {
    if (!url || !url.startsWith("/products/")) return url
    return url.replace(/(\.[a-z0-9]+)(\?.*)?$/i, "_thumb$1")
}
