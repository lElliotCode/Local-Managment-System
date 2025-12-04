import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


// Types

export type Product = {
    id: string,
    name: string,
    price: number,
    stock: number,
    category: string | null,
    low_stock_threshold: number,
    created_at: string,
    updated_at: string
}

export type Sale = {
    id: string,
    total: number,
    created_at: string
}

export type SaleItem = {
    id: string,
    sale_id: string,
    product_id: string,
    product_name: string,
    quantity: number,
    unit_price: number,
    subtotal: number,
    created_at: string
}

// Herlper para formatear moneda

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
    }).format(amount)
}
