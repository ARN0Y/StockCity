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

const UPLOADS_DIR = path.join(process.cwd(), "uploads")

const MAX_DIMENSION = 1400
const THUMB_DIMENSION = 480
const QUALITY = 80

async function ensureDir() {
    await fs.mkdir(UPLOADS_DIR, { recursive: true })
}

export interface OptimizedImage {
    url: string
    thumbUrl: string
    width: number
    height: number
    bytes: number
}

export function fileSlug(input: string): string {
    return (input || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50)
}

function buildBaseName(hint?: string): string {
    const slug = fileSlug(hint || "")
    const rand = randomUUID().slice(0, 6)
    return slug ? `${slug}-${rand}` : `product-${rand}`
}

export async function optimizeAndSaveImage(
    input: Buffer | Uint8Array,
    nameHint?: string,
): Promise<OptimizedImage> {
    await ensureDir()

    const base = buildBaseName(nameHint)
    const baseName = `${base}.webp`
    const thumbName = `${base}_thumb.webp`
    const mainPath = path.join(UPLOADS_DIR, baseName)
    const thumbPath = path.join(UPLOADS_DIR, thumbName)

    const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input)
    const sharp = await getSharp()

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
        url: `/media/${baseName}`,
        thumbUrl: `/media/${thumbName}`,
        width: mainInfo.width,
        height: mainInfo.height,
        bytes: mainInfo.size,
    }
}

export async function deleteImageFiles(publicUrl: string): Promise<void> {
    if (!publicUrl || !publicUrl.startsWith("/media/")) return
    const fileName = path.basename(publicUrl)
    if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) return

    const mainPath = path.join(UPLOADS_DIR, fileName)
    const thumbName = fileName.replace(/(\.[a-z0-9]+)$/i, "_thumb$1")
    const thumbPath = path.join(UPLOADS_DIR, thumbName)

    await Promise.allSettled([
        fs.unlink(mainPath),
        thumbName !== fileName ? fs.unlink(thumbPath) : Promise.resolve(),
    ])
}

export function toThumbUrl(url: string): string {
    if (!url || !url.startsWith("/media/")) return url
    return url.replace(/(\.[a-z0-9]+)(\?.*)?$/i, "_thumb$1")
}
