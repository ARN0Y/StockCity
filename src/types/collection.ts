export type StockStatus = "in_stock" | "call_for_price" | "out_of_stock"

export interface Category {
    id: string
    name: string
    slug: string
    parent_id?: string | null
    sort_order?: number
    children?: Category[]
}

export interface Brand {
    id: string
    name: string
    slug: string
    logo_url?: string | null
}

export interface Product {
    id: string
    title: string
    model_number: string
    description?: string | null
    category_id?: string | null
    brand_id?: string | null
    images: string[]
    specifications?: Record<string, string>
    key_features?: string[]
    stock_status: StockStatus
    stock_quantity?: number | null
    price?: number | null
    created_at?: string
    updated_at?: string
    brand?: { id?: string; name: string; slug?: string; logo_url?: string | null } | null
    category?: { id?: string; name: string; slug?: string } | null
    brands?: { name: string } | null
    categories?: { name: string } | null
}
