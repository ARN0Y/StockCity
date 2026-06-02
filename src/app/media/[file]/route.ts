import type { NextRequest } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

export const dynamic = "force-dynamic"

const UPLOADS_DIR = path.join(process.cwd(), "uploads")

const CONTENT_TYPES: Record<string, string> = {
    ".webp": "image/webp",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".avif": "image/avif",
}

// سرو فایل‌های آپلودشده از پوشه‌ی uploads (خارج از public تا در runtime هم سرو شوند)
export async function GET(_req: NextRequest, { params }: { params: Promise<{ file: string }> }) {
    const { file } = await params

    // جلوگیری از path traversal
    if (!file || file.includes("..") || file.includes("/") || file.includes("\\")) {
        return new Response("Not found", { status: 404 })
    }

    const ext = path.extname(file).toLowerCase()
    const type = CONTENT_TYPES[ext]
    if (!type) return new Response("Not found", { status: 404 })

    try {
        const buf = await readFile(path.join(UPLOADS_DIR, file))
        return new Response(new Uint8Array(buf), {
            headers: {
                "Content-Type": type,
                // نام فایل‌ها یکتا (هش‌دار) است، پس کش طولانی امن است.
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        })
    } catch {
        return new Response("Not found", { status: 404 })
    }
}
