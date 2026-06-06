// لایه دیتابیس داخلی پروژه — SQLite (better-sqlite3).
// فایل دیتابیس به‌صورت خودکار در مسیر data/stockcity.db ساخته می‌شود؛
// هیچ سرور یا سرویس خارجی لازم نیست.

import Database from "better-sqlite3"
import { randomUUID } from "crypto"
import path from "path"
import fs from "fs"
import {
    seedBrands,
    seedCategories,
    seedProducts,
    slugify,
} from "./seed-data"

export type StockStatus = "in_stock" | "call_for_price" | "out_of_stock"

export interface Brand {
    id: string
    name: string
    slug: string
    logo_url: string | null
    website: string | null
}

export interface Category {
    id: string
    name: string
    slug: string
    parent_id: string | null
    sort_order: number
}

export interface Product {
    id: string
    title: string
    model_number: string
    description: string | null
    category_id: string | null
    brand_id: string | null
    images: string[]
    specifications: Record<string, string>
    key_features: string[]
    stock_status: StockStatus
    stock_quantity: number | null
    created_at: string
    updated_at: string
    brand?: Pick<Brand, "id" | "name" | "slug" | "logo_url"> | null
    category?: Pick<Category, "id" | "name" | "slug"> | null
    brands?: { name: string } | null
    categories?: { name: string } | null
}

/* اتصال (singleton)                                                    */
let _db: Database.Database | null = null

function connect(): Database.Database {
    const dataDir = path.join(process.cwd(), "data")
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

    const db = new Database(path.join(dataDir, "stockcity.db"))
    db.pragma("journal_mode = WAL")
    db.pragma("foreign_keys = ON")

    migrate(db)
    seed(db)
    return db
}

export function getDb(): Database.Database {
    if (!_db) _db = connect()
    return _db
}

/* ساخت جدول‌ها                                                         */
function migrate(db: Database.Database) {
    db.exec(`
        CREATE TABLE IF NOT EXISTS categories (
            id          TEXT PRIMARY KEY,
            name        TEXT NOT NULL,
            slug        TEXT NOT NULL UNIQUE,
            parent_id   TEXT,
            sort_order  INTEGER NOT NULL DEFAULT 0,
            created_at  TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS brands (
            id          TEXT PRIMARY KEY,
            name        TEXT NOT NULL,
            slug        TEXT NOT NULL UNIQUE,
            logo_url    TEXT,
            website     TEXT,
            created_at  TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS products (
            id              TEXT PRIMARY KEY,
            title           TEXT NOT NULL,
            model_number    TEXT NOT NULL UNIQUE,
            description     TEXT,
            category_id     TEXT REFERENCES categories(id) ON DELETE SET NULL,
            brand_id        TEXT REFERENCES brands(id) ON DELETE SET NULL,
            images          TEXT NOT NULL DEFAULT '[]',
            specifications  TEXT NOT NULL DEFAULT '{}',
            key_features    TEXT NOT NULL DEFAULT '[]',
            stock_status    TEXT NOT NULL DEFAULT 'in_stock',
            stock_quantity  INTEGER,
            created_at      TEXT NOT NULL,
            updated_at      TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
        CREATE INDEX IF NOT EXISTS idx_products_brand    ON products(brand_id);
        CREATE INDEX IF NOT EXISTS idx_products_created  ON products(created_at);

        CREATE TABLE IF NOT EXISTS settings (
            key   TEXT PRIMARY KEY,
            value TEXT NOT NULL DEFAULT ''
        );
    `)

    migrateCategories(db)
}

/* به‌روزرسانی دسته‌بندی‌ها روی دیتابیس‌های موجود (idempotent) */
function migrateCategories(db: Database.Database) {
    const now = new Date().toISOString()

    // «کنتاکتور اکبند» → «اینورتر» (تغییر نام و نامک)
    const reversing = db
        .prepare("SELECT id FROM categories WHERE slug = 'contactor-reversing'")
        .get() as { id: string } | undefined
    if (reversing) {
        const inverterExists = db.prepare("SELECT 1 FROM categories WHERE slug = 'inverter'").get()
        if (inverterExists) {
            // اگر دسته‌ی inverter از قبل هست، محصولات را منتقل و قدیمی را حذف کن
            db.prepare("UPDATE products SET category_id = (SELECT id FROM categories WHERE slug='inverter') WHERE category_id = ?").run(reversing.id)
            db.prepare("DELETE FROM categories WHERE id = ?").run(reversing.id)
        } else {
            db.prepare("UPDATE categories SET slug = 'inverter', name = 'اینورتر', sort_order = 2 WHERE id = ?").run(reversing.id)
        }
    }

    // افزودن دسته‌ی «کالای متفرقه» در صورت نبود
    const miscExists = db.prepare("SELECT 1 FROM categories WHERE slug = 'misc'").get()
    if (!miscExists) {
        db.prepare(
            "INSERT INTO categories (id, name, slug, parent_id, sort_order, created_at) VALUES (?,?,?,?,?,?)",
        ).run(randomUUID(), "کالای متفرقه", "misc", null, 5, now)
    }
}

/* درج داده اولیه (فقط وقتی دیتابیس خالی است)                            */
function seed(db: Database.Database) {
    const count = (db.prepare("SELECT COUNT(*) AS c FROM products").get() as { c: number }).c
    if (count > 0) return

    const now = new Date().toISOString()

    const insertCat = db.prepare(
        "INSERT INTO categories (id, name, slug, parent_id, sort_order, created_at) VALUES (?,?,?,?,?,?)",
    )
    const insertBrand = db.prepare(
        "INSERT INTO brands (id, name, slug, logo_url, website, created_at) VALUES (?,?,?,?,?,?)",
    )
    const insertProduct = db.prepare(`
        INSERT INTO products
            (id, title, model_number, description, category_id, brand_id,
             images, specifications, key_features, stock_status, stock_quantity, created_at, updated_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
    `)

    const tx = db.transaction(() => {
        const catId: Record<string, string> = {}
        for (const c of seedCategories) {
            const id = randomUUID()
            catId[c.slug] = id
            insertCat.run(id, c.name, c.slug, null, c.sort_order, now)
        }

        const brandId: Record<string, string> = {}
        for (const b of seedBrands) {
            const id = randomUUID()
            brandId[b.name] = id
            insertBrand.run(id, b.name, b.slug, null, null, now)
        }

        let i = 0
        for (const p of seedProducts) {
            const created = new Date(Date.now() - (seedProducts.length - i) * 60000).toISOString()
            insertProduct.run(
                randomUUID(),
                p.title,
                p.model_number,
                null,
                catId[p.categorySlug] ?? null,
                brandId[p.brandName] ?? null,
                "[]",
                JSON.stringify(p.specifications),
                JSON.stringify(p.key_features),
                p.stock_status,
                p.stock_quantity,
                created,
                created,
            )
            i++
        }
    })

    tx()
    console.log(
        `✅ دیتابیس استوک سیتی مقداردهی شد: ${seedProducts.length} محصول، ${seedBrands.length} برند، ${seedCategories.length} دسته.`,
    )
}

/* تبدیل ردیف خام به آبجکت محصول                                         */
type RawProductRow = {
    id: string
    title: string
    model_number: string
    description: string | null
    category_id: string | null
    brand_id: string | null
    images: string
    specifications: string
    key_features: string
    stock_status: StockStatus
    stock_quantity: number | null
    created_at: string
    updated_at: string
    brand_name?: string | null
    brand_slug?: string | null
    brand_logo?: string | null
    category_name?: string | null
    category_slug?: string | null
}

function safeJson<T>(value: string | null | undefined, fallback: T): T {
    if (!value) return fallback
    try {
        return JSON.parse(value) as T
    } catch {
        return fallback
    }
}

function mapProduct(row: RawProductRow): Product {
    const brand = row.brand_id
        ? {
              id: row.brand_id,
              name: row.brand_name ?? "",
              slug: row.brand_slug ?? "",
              logo_url: row.brand_logo ?? null,
          }
        : null
    const category = row.category_id
        ? { id: row.category_id, name: row.category_name ?? "", slug: row.category_slug ?? "" }
        : null

    return {
        id: row.id,
        title: row.title,
        model_number: row.model_number,
        description: row.description,
        category_id: row.category_id,
        brand_id: row.brand_id,
        images: safeJson<string[]>(row.images, []),
        specifications: safeJson<Record<string, string>>(row.specifications, {}),
        key_features: safeJson<string[]>(row.key_features, []),
        stock_status: row.stock_status,
        stock_quantity: row.stock_quantity,
        created_at: row.created_at,
        updated_at: row.updated_at,
        brand,
        category,
        brands: brand ? { name: brand.name } : null,
        categories: category ? { name: category.name } : null,
    }
}

const PRODUCT_COLUMNS = `
    p.*,
    b.name AS brand_name, b.slug AS brand_slug, b.logo_url AS brand_logo,
    c.name AS category_name, c.slug AS category_slug
`

const JOINS = `
    FROM products p
    LEFT JOIN brands b     ON b.id = p.brand_id
    LEFT JOIN categories c ON c.id = p.category_id
`

// شرط یکسان و کاملاً پارامتری برای همه حالت‌ها (NULL یعنی فیلتر غیرفعال).
const FILTER = `
    WHERE (@categorySlug IS NULL OR c.slug = @categorySlug)
      AND (@brandSlug    IS NULL OR b.slug = @brandSlug)
      AND (@stockStatus  IS NULL OR p.stock_status = @stockStatus)
      AND (@q IS NULL OR p.title LIKE @q OR p.model_number LIKE @q)
`

// رشته‌های SQL کاملاً ثابت‌اند (فقط جهت مرتب‌سازی متغیر است).
const SQL_LIST_DESC = `SELECT ${PRODUCT_COLUMNS} ${JOINS} ${FILTER} ORDER BY p.created_at DESC, p.id ASC LIMIT @limit OFFSET @offset`
const SQL_LIST_ASC = `SELECT ${PRODUCT_COLUMNS} ${JOINS} ${FILTER} ORDER BY p.created_at ASC, p.id ASC LIMIT @limit OFFSET @offset`
const SQL_LIST_TITLE = `SELECT ${PRODUCT_COLUMNS} ${JOINS} ${FILTER} ORDER BY p.title ASC, p.id ASC LIMIT @limit OFFSET @offset`
const SQL_COUNT = `SELECT COUNT(*) AS c ${JOINS} ${FILTER}`

/* خواندن محصولات + فیلتر + صفحه‌بندی                                    */
export interface ProductFilters {
    categorySlug?: string
    brandSlug?: string
    stockStatus?: StockStatus
    query?: string
    sort?: "newest" | "oldest" | "title"
}

export function listProducts(
    page: number,
    perPage: number,
    filters: ProductFilters = {},
): { data: Product[]; total: number } {
    const db = getDb()

    const params = {
        categorySlug: filters.categorySlug?.trim() || null,
        brandSlug: filters.brandSlug?.trim() || null,
        stockStatus: filters.stockStatus || null,
        q: filters.query && filters.query.trim() ? `%${filters.query.trim()}%` : null,
        limit: perPage,
        offset: (page - 1) * perPage,
    }

    const total = (
        db.prepare(SQL_COUNT).get({
            categorySlug: params.categorySlug,
            brandSlug: params.brandSlug,
            stockStatus: params.stockStatus,
            q: params.q,
        }) as { c: number }
    ).c

    const sql =
        filters.sort === "oldest"
            ? SQL_LIST_ASC
            : filters.sort === "title"
              ? SQL_LIST_TITLE
              : SQL_LIST_DESC
    const rows = db.prepare(sql).all(params) as RawProductRow[]

    return { data: rows.map(mapProduct), total }
}

export function getProductByModel(model: string): Product | null {
    const row = getDb()
        .prepare(`SELECT ${PRODUCT_COLUMNS} ${JOINS} WHERE p.model_number = @model`)
        .get({ model }) as RawProductRow | undefined
    return row ? mapProduct(row) : null
}

export function getProductById(id: string): Product | null {
    const row = getDb()
        .prepare(`SELECT ${PRODUCT_COLUMNS} ${JOINS} WHERE p.id = @id`)
        .get({ id }) as RawProductRow | undefined
    return row ? mapProduct(row) : null
}

/* نوشتن محصول                                                          */
export interface ProductInput {
    title: string
    model_number: string
    description?: string | null
    brand_id?: string | null
    category_id?: string | null
    images?: string[]
    specifications?: Record<string, string>
    key_features?: string[]
    stock_status?: StockStatus
    stock_quantity?: number | null
}

export function createProduct(input: ProductInput): string {
    const db = getDb()
    const id = randomUUID()
    const now = new Date().toISOString()
    db.prepare(`
        INSERT INTO products
            (id, title, model_number, description, category_id, brand_id,
             images, specifications, key_features, stock_status, stock_quantity, created_at, updated_at)
        VALUES (@id,@title,@model_number,@description,@category_id,@brand_id,
                @images,@specifications,@key_features,@stock_status,@stock_quantity,@created_at,@updated_at)
    `).run({
        id,
        title: input.title,
        model_number: input.model_number,
        description: input.description ?? null,
        category_id: input.category_id || null,
        brand_id: input.brand_id || null,
        images: JSON.stringify(input.images ?? []),
        specifications: JSON.stringify(input.specifications ?? {}),
        key_features: JSON.stringify(input.key_features ?? []),
        stock_status: input.stock_status ?? "in_stock",
        stock_quantity: input.stock_quantity ?? null,
        created_at: now,
        updated_at: now,
    })
    return id
}

export function updateProduct(id: string, input: ProductInput): void {
    const db = getDb()
    const now = new Date().toISOString()
    db.prepare(`
        UPDATE products SET
            title          = @title,
            model_number   = @model_number,
            description    = @description,
            category_id    = @category_id,
            brand_id       = @brand_id,
            images         = @images,
            specifications = @specifications,
            key_features   = @key_features,
            stock_status   = @stock_status,
            stock_quantity = @stock_quantity,
            updated_at     = @updated_at
        WHERE id = @id
    `).run({
        id,
        title: input.title,
        model_number: input.model_number,
        description: input.description ?? null,
        category_id: input.category_id || null,
        brand_id: input.brand_id || null,
        images: JSON.stringify(input.images ?? []),
        specifications: JSON.stringify(input.specifications ?? {}),
        key_features: JSON.stringify(input.key_features ?? []),
        stock_status: input.stock_status ?? "in_stock",
        stock_quantity: input.stock_quantity ?? null,
        updated_at: now,
    })
}

export function deleteProductById(id: string): void {
    getDb().prepare("DELETE FROM products WHERE id = @id").run({ id })
}

/* برند و دسته                                                          */
export function listBrands(): Brand[] {
    return getDb()
        .prepare("SELECT id, name, slug, logo_url, website FROM brands ORDER BY name")
        .all() as Brand[]
}

export function listCategories(): Category[] {
    return getDb()
        .prepare("SELECT id, name, slug, parent_id, sort_order FROM categories ORDER BY sort_order, name")
        .all() as Category[]
}

export function getCategoryBySlug(slug: string): Category | null {
    const row = getDb()
        .prepare("SELECT id, name, slug, parent_id, sort_order FROM categories WHERE slug = @slug")
        .get({ slug }) as Category | undefined
    return row ?? null
}

export interface CategoryWithCount extends Category {
    product_count: number
}

export function listCategoriesWithCounts(): CategoryWithCount[] {
    return getDb()
        .prepare(`
            SELECT c.id, c.name, c.slug, c.parent_id, c.sort_order,
                   (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS product_count
            FROM categories c
            ORDER BY c.sort_order, c.name
        `)
        .all() as CategoryWithCount[]
}

function uniqueCategorySlug(base: string, ignoreId?: string): string {
    const db = getDb()
    let slug = base || `cat-${randomUUID().slice(0, 6)}`
    let i = 1
    for (;;) {
        const row = db
            .prepare("SELECT id FROM categories WHERE slug = ?")
            .get(slug) as { id: string } | undefined
        if (!row || row.id === ignoreId) return slug
        slug = `${base}-${i++}`
    }
}

export function createCategory(input: { name: string; slug?: string; sort_order?: number }): string {
    const db = getDb()
    const id = randomUUID()
    const slug = uniqueCategorySlug((input.slug?.trim() || slugify(input.name)).toLowerCase())
    const order =
        input.sort_order ??
        ((db.prepare("SELECT COALESCE(MAX(sort_order),0)+1 AS n FROM categories").get() as { n: number }).n)
    db.prepare(
        "INSERT INTO categories (id, name, slug, parent_id, sort_order, created_at) VALUES (?,?,?,?,?,?)",
    ).run(id, input.name.trim(), slug, null, order, new Date().toISOString())
    return id
}

export function updateCategory(
    id: string,
    input: { name: string; slug?: string; sort_order?: number },
): void {
    const db = getDb()
    const slug = uniqueCategorySlug((input.slug?.trim() || slugify(input.name)).toLowerCase(), id)
    db.prepare(
        "UPDATE categories SET name = @name, slug = @slug, sort_order = @sort_order WHERE id = @id",
    ).run({
        id,
        name: input.name.trim(),
        slug,
        sort_order: input.sort_order ?? 0,
    })
}

export function deleteCategoryById(id: string): void {
    // FK روی products با ON DELETE SET NULL تعریف شده، پس محصولات حذف نمی‌شوند.
    getDb().prepare("DELETE FROM categories WHERE id = @id").run({ id })
}

export interface BrandWithCount extends Brand {
    product_count: number
}

export function listBrandsWithCounts(): BrandWithCount[] {
    return getDb()
        .prepare(`
            SELECT b.id, b.name, b.slug, b.logo_url, b.website,
                   (SELECT COUNT(*) FROM products p WHERE p.brand_id = b.id) AS product_count
            FROM brands b
            ORDER BY b.name
        `)
        .all() as BrandWithCount[]
}

export function createBrand(name: string): { id: string; name: string } {
    const id = findOrCreateBrand(name)
    return { id, name: name.trim() }
}

export function findOrCreateBrand(name: string): string {
    const db = getDb()
    const clean = name.trim()
    const existing = db.prepare("SELECT id FROM brands WHERE name = @name").get({ name: clean }) as
        | { id: string }
        | undefined
    if (existing) return existing.id
    const id = randomUUID()
    db.prepare(
        "INSERT INTO brands (id, name, slug, logo_url, website, created_at) VALUES (?,?,?,?,?,?)",
    ).run(id, clean, slugify(clean) || randomUUID().slice(0, 8), null, null, new Date().toISOString())
    return id
}

/* تنظیمات سایت (key/value)                                              */
export function getSettings(): Record<string, string> {
    const rows = getDb().prepare("SELECT key, value FROM settings").all() as {
        key: string
        value: string
    }[]
    const out: Record<string, string> = {}
    for (const r of rows) out[r.key] = r.value
    return out
}

export function setSettings(values: Record<string, string>): void {
    const db = getDb()
    const stmt = db.prepare(
        "INSERT INTO settings (key, value) VALUES (@key, @value) ON CONFLICT(key) DO UPDATE SET value = @value",
    )
    const tx = db.transaction((entries: [string, string][]) => {
        for (const [key, value] of entries) stmt.run({ key, value: value ?? "" })
    })
    tx(Object.entries(values))
}

export function counts(): { products: number; brands: number; categories: number } {
    const db = getDb()
    return {
        products: (db.prepare("SELECT COUNT(*) c FROM products").get() as { c: number }).c,
        brands: (db.prepare("SELECT COUNT(*) c FROM brands").get() as { c: number }).c,
        categories: (db.prepare("SELECT COUNT(*) c FROM categories").get() as { c: number }).c,
    }
}

/* خروجی همه‌ی محصولات (برای Export)                                     */
export function allProductsForExport(): Product[] {
    const rows = getDb()
        .prepare(`SELECT ${PRODUCT_COLUMNS} ${JOINS} ORDER BY p.created_at DESC`)
        .all() as RawProductRow[]
    return rows.map(mapProduct)
}

/* ورود گروهی محصولات (Import)                                          */
/* هر ردیف بر اساس model_number یکتا: اگر باشد به‌روزرسانی، وگرنه ایجاد.    */
/* برند و دسته با نام تطبیق داده می‌شوند (نبودند ساخته می‌شوند).           */
export interface ImportRow {
    title: string
    model_number: string
    brandName?: string
    categoryName?: string
    stock_status?: StockStatus
    stock_quantity?: number | null
    specifications?: Record<string, string>
    key_features?: string[]
    description?: string | null
}

export interface ImportResult {
    created: number
    updated: number
    skipped: number
    errors: string[]
}

function findOrCreateCategoryByName(name: string): string {
    const db = getDb()
    const clean = name.trim()
    const existing = db.prepare("SELECT id FROM categories WHERE name = ?").get(clean) as
        | { id: string }
        | undefined
    if (existing) return existing.id
    return createCategory({ name: clean })
}

export function importProducts(rows: ImportRow[]): ImportResult {
    const db = getDb()
    const result: ImportResult = { created: 0, updated: 0, skipped: 0, errors: [] }

    const findByModel = db.prepare("SELECT id FROM products WHERE model_number = ?")

    const tx = db.transaction(() => {
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i]
            const line = i + 2 // شماره‌ی سطر در فایل (با هدر)
            try {
                if (!row.title?.trim() || !row.model_number?.trim()) {
                    result.skipped++
                    result.errors.push(`سطر ${line}: عنوان یا کد فنی خالی است.`)
                    continue
                }

                const brand_id = row.brandName?.trim() ? findOrCreateBrand(row.brandName) : null
                const category_id = row.categoryName?.trim()
                    ? findOrCreateCategoryByName(row.categoryName)
                    : null

                const existing = findByModel.get(row.model_number.trim()) as { id: string } | undefined

                const input: ProductInput = {
                    title: row.title.trim(),
                    model_number: row.model_number.trim(),
                    description: row.description ?? null,
                    brand_id,
                    category_id,
                    stock_status: row.stock_status ?? "in_stock",
                    stock_quantity: row.stock_quantity ?? null,
                    specifications: row.specifications ?? {},
                    key_features: row.key_features ?? [],
                }

                if (existing) {
                    // در حالت آپدیت، تصاویر دست‌نخورده می‌مانند
                    db.prepare(`
                        UPDATE products SET
                            title=@title, description=@description, category_id=@category_id, brand_id=@brand_id,
                            specifications=@specifications, key_features=@key_features,
                            stock_status=@stock_status, stock_quantity=@stock_quantity, updated_at=@now
                        WHERE id=@id
                    `).run({
                        id: existing.id,
                        title: input.title,
                        description: input.description,
                        category_id: input.category_id,
                        brand_id: input.brand_id,
                        specifications: JSON.stringify(input.specifications),
                        key_features: JSON.stringify(input.key_features),
                        stock_status: input.stock_status,
                        stock_quantity: input.stock_quantity,
                        now: new Date().toISOString(),
                    })
                    result.updated++
                } else {
                    createProduct(input)
                    result.created++
                }
            } catch (e: any) {
                result.skipped++
                result.errors.push(`سطر ${line}: ${e?.message ?? "خطای ناشناخته"}`)
            }
        }
    })

    tx()
    return result
}
