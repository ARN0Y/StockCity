// ابزار سبک CSV بدون وابستگی خارجی. سازگار با Excel (UTF-8 BOM).

export function toCsvCell(value: unknown): string {
    const s = value == null ? "" : String(value)
    // اگر شامل کاما، نقل‌قول یا خط جدید بود، داخل "" قرار می‌گیرد و " دوتایی می‌شود.
    if (/[",\n\r]/.test(s)) {
        return `"${s.replace(/"/g, '""')}"`
    }
    return s
}

export function rowsToCsv(headers: string[], rows: (unknown[])[]): string {
    const lines = [headers.map(toCsvCell).join(",")]
    for (const row of rows) lines.push(row.map(toCsvCell).join(","))
    // BOM برای نمایش درست فارسی در اکسل
    return "﻿" + lines.join("\r\n")
}

/** پارس CSV با پشتیبانی از فیلدهای نقل‌قول‌دار و خط جدید داخل فیلد. */
export function parseCsv(text: string): string[][] {
    // حذف BOM
    const input = text.replace(/^﻿/, "")
    const rows: string[][] = []
    let field = ""
    let row: string[] = []
    let inQuotes = false

    for (let i = 0; i < input.length; i++) {
        const ch = input[i]

        if (inQuotes) {
            if (ch === '"') {
                if (input[i + 1] === '"') {
                    field += '"'
                    i++
                } else {
                    inQuotes = false
                }
            } else {
                field += ch
            }
        } else {
            if (ch === '"') {
                inQuotes = true
            } else if (ch === ",") {
                row.push(field)
                field = ""
            } else if (ch === "\n") {
                row.push(field)
                rows.push(row)
                row = []
                field = ""
            } else if (ch === "\r") {
                // نادیده (در \r\n)
            } else {
                field += ch
            }
        }
    }
    // آخرین فیلد/سطر
    if (field.length > 0 || row.length > 0) {
        row.push(field)
        rows.push(row)
    }
    return rows.filter((r) => r.some((c) => c.trim() !== ""))
}
