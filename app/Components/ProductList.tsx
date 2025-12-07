'use client'

import { useEffect, useState } from "react"
import { supabase, type Product, formatCurrency, formatStock } from "@/lib/supabase"

type Props = {
    refreshTrigger?: number
}

export default function ProductList({ refreshTrigger }: Props) {

    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editStock, setEditStock] = useState('')

    useEffect(() => {
        fetchProducts()
    }, [refreshTrigger])

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('name', { ascending: true })

            if (error) throw error

            setProducts(data || [])
        } catch (error) {
            console.error('Error fetching products: ', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredProducts = products.filter(p => {
        if (!searchQuery) return products

        const query = searchQuery.toLocaleLowerCase()
        return (
            p.name.toLocaleLowerCase().includes(query) ||
            p.category?.toLocaleLowerCase().includes(query)
        )
    })

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Eliminar "${name}"?`)) return

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id)

            if (error) throw error

            alert('✅ Producto eliminado correctamente')

            fetchProducts()

        } catch (error) {
            console.error('Error al eliminar: ', error)
            alert('❌ Ocurrió un error al eliminar el producto')
        }
    }

    const handleUpdateStock = async (id: string, newStock: number) => {
        try {
            const { error } = await supabase
                .from('products')
                .update({
                    stock: newStock,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)

            if (error) throw error

            setEditingId(null)
            fetchProducts()
            alert('✅ Stock actualizado')
        } catch (error) {
            console.error('Error:', error)
            alert('❌ Error al actualizar')
        }
    }

    if (loading) {
        return (
            <div className="space-y-3 flex gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="border border-slate-100 hover:shadow-xl rounded-lg w-[200px] flex flex-col justify-end h-50 bg-white px-4 py-4 ">
                        <div className="h-30 w-[120px] bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
                        <div className="h-6 w-[150px] bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div>
                <h3>Productos ({filteredProducts.length})</h3>
            </div>
            <div className="border border-zinc-100 bg-white px-4 rounded-lg focus-within:border-zinc-900">
                <span>🔍</span>
                <input
                    type="text"
                    placeholder=" Buscar producto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 w-128 outline-none"
                />
            </div>

            {filteredProducts.length === 0 && (
                <div>
                    {searchQuery ? (
                        <>
                            <p className="text-4xl mb-2">🔍</p>
                            <p>No se encontraron productos con "{searchQuery}"</p>
                        </>
                    ) : (
                        <>
                            <p className="text-4xl mb-2">📦</p>
                            <p>No hay productos aún. Agrega el primero arriba</p>
                        </>
                    )}
                </div>
            )}

            <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
                {filteredProducts.map((product) => {
                    const isLowStock = product.stock <= product.low_stock_threshold
                    const isCritical = product.stock <= 2
                    return (
                        <div
                            key={product.id}
                            className="border border-slate-100 hover:shadow-xl rounded-lg bg-white px-4 py-4 transition-shadow min-h-[150px]"
                        >
                            <div className="flex flex-col items-start justify-between h-full">
                                <div className="flex items-center justify-between gap-2 w-full">
                                    <h4 className="font-semibold text-lg">{product.name}</h4>
                                    {product.category && (
                                        <span className="text-xs px-2 py-1 bg-gray-100 rounded text-center">
                                            {product.category}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <div>
                                        <div className="mt-2 flex items-center gap-4 text-sm">
                                            <span className="font-semibold text-xl text-slate-900">
                                                {formatCurrency(product.price)}
                                            </span>

                                            <span
                                                className={`font-medium ${isCritical ? 'text-red-600' :
                                                    isLowStock ? 'text-orange-600' :
                                                        'text-gray-600'
                                                    }`}>
                                                Stock: {formatStock(product.stock, product.unit)}
                                                {isCritical && ' 🔴'}
                                                {isLowStock && !isCritical && ' ⚠️'}
                                            </span>


                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            className="text-red-600 hover:text-red-800 text-sm px-3 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                                            onClick={() => handleDelete(product.id, product.name)}
                                        >
                                            Eliminar
                                        </button>
                                        {editingId === product.id ? (
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    step={product.unit === 'kg' ? '0.1' : '1'}
                                                    min="0"
                                                    value={editStock}
                                                    onChange={(e) => setEditStock(e.target.value)}
                                                    required
                                                    placeholder={product.unit === 'kg' ? '25.5' : '50'}
                                                    className="w-20 px-2 py-1 border rounded text-sm mb-2"
                                                    autoFocus
                                                />
                                                <div className="flex justify-around">
                                                    <button
                                                        onClick={() => handleUpdateStock(product.id, parseFloat(editStock))}
                                                        className="text-green-600 text-sm hover:bg-green-200 px-1 rounded"
                                                    >
                                                        ✓
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="text-red-600 text-sm px-1 rounded hover:bg-red-200"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setEditingId(product.id)
                                                    setEditStock(product.stock.toString())
                                                }}
                                                className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                                            >
                                                Editar stock
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}