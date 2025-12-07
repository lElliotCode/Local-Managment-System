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
    unit: 'kg' | 'unidad' // nuevo campo
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

export type CartItem = {
    product: Product
    quantity: number
    subtotal: number
}

export type SaleWithItems = {
    sale: Sale
    items: SaleItem[]
}

// Helper para formatear stock con unidad
export const formatStock = (quantity: number, unit: 'kg' | 'unidad'): string => {
  if (unit === 'kg') {
    return `${quantity} kg`
  }
  return `${quantity} ${quantity === 1 ? 'unidad' : 'unidades'}`
}

// Categorías predefinidas con sus unidades
export const CATEGORIES = [
  { name: 'Panadería', unit: 'kg' as const },
  { name: 'Rotisería', unit: 'kg' as const },
  { name: 'Bebidas', unit: 'unidad' as const },
  { name: 'Almacén', unit: 'unidad' as const },
] as const

// Helper para formatear moneda

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
    }).format(amount)
}
