// احراز هویت سبک و بدون وابستگی خارجی: کوکی امضاشده با HMAC-SHA256.
// با Web Crypto پیاده شده تا هم در Middleware (Edge) و هم در Server Action (Node) کار کند.

export const AUTH_COOKIE = "sc_session"
const DEFAULT_SECRET = "stock-city-dev-secret-change-me"
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // یک هفته

export interface SessionPayload {
    u: string // نام کاربری
    exp: number // زمان انقضا (ثانیه)
}

function getSecret(): string {
    return process.env.AUTH_SECRET || DEFAULT_SECRET
}

function toB64Url(bytes: Uint8Array): string {
    let bin = ""
    for (const b of bytes) bin += String.fromCharCode(b)
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromB64Url(str: string): Uint8Array {
    const b64 = str.replace(/-/g, "+").replace(/_/g, "/")
    const bin = atob(b64 + "===".slice((b64.length + 3) % 4))
    const out = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
    return out
}

async function hmac(data: string): Promise<Uint8Array> {
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(getSecret()),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
    )
    const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data))
    return new Uint8Array(sig)
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false
    let diff = 0
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
    return diff === 0
}

export async function createSessionToken(username: string): Promise<string> {
    const payload: SessionPayload = {
        u: username,
        exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
    }
    const data = toB64Url(new TextEncoder().encode(JSON.stringify(payload)))
    const sig = toB64Url(await hmac(data))
    return `${data}.${sig}`
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
    if (!token || !token.includes(".")) return null
    const [data, sig] = token.split(".")
    if (!data || !sig) return null

    const expected = await hmac(data)
    let provided: Uint8Array
    try {
        provided = fromB64Url(sig)
    } catch {
        return null
    }
    if (!timingSafeEqual(expected, provided)) return null

    try {
        const payload = JSON.parse(new TextDecoder().decode(fromB64Url(data))) as SessionPayload
        if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null
        return payload
    } catch {
        return null
    }
}

export const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
}

export function checkCredentials(username: string, password: string): boolean {
    const u = process.env.ADMIN_USERNAME || "admin"
    const p = process.env.ADMIN_PASSWORD || "stockcity1404"
    // مقایسه ساده (مقادیر از env می‌آیند، نه ورودی شبکه‌ای حجیم)
    return username.trim() === u && password === p
}
