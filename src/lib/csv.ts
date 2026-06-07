export function toCsvCell(value: unknown): string {
    const s = value == null ? "" : String(value)
    if (/[",\n\r]/.test(s)) {
        return `"${s.replace(/"/g, '""')}"`
    }
    return s
}

export function rowsToCsv(headers: string[], rows: (unknown[])[]): string {
    const lines = [headers.map(toCsvCell).join(",")]
    for (const row of rows) lines.push(row.map(toCsvCell).join(","))
    return "﻿" + lines.join("\r\n")
}

export function parseCsv(text: string): string[][] {
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
            } else {
                field += ch
            }
        }
    }
    if (field.length > 0 || row.length > 0) {
        row.push(field)
        rows.push(row)
    }
    return rows.filter((r) => r.some((c) => c.trim() !== ""))
}
