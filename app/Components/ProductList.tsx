'use client'

import { useEffect, useState } from "react"
import { supabase, type Product, formatCurrency } from "@/lib/supabase"

type Props = {
    refreshTrigger?: number
}

export default function ProductList({ refreshTrigger }: Props) {

    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

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
        if(!confirm(`Eliminar "${name}"?`)) return

        try {
            const {error} = await supabase
                .from('products')
                .delete()
                .eq('id', id)

            if(error) throw error

            alert('✅ Producto eliminado correctamente')

            fetchProducts()

        } catch (error) {
            console.error('Error al eliminar: ', error)
            alert('❌ Ocurrió un error al eliminar el producto')
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

            <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
                {filteredProducts.map((product) => {
                    const isLowStock = product.stock <= product.low_stock_threshold
                    const isCritical = product.stock <= 2
                    return (
                        <div
                            key={product.id}
                            className="border border-slate-100 hover:shadow-xl rounded-lg bg-white px-4 py-4 transition-shadow min-h-[150px]"
                        >
                            <div className="flex flex-col items-start justify-between h-full">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-lg">{product.name}</h4>
                                        {product.category && (
                                            <span className="text-xs px-2 py-1 bg-gray">
                                                {product.category}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-2 flex items-center gap-4 text-sm">
                                        <span className="font-semibold text-xl text-slate-900">
                                            {formatCurrency(product.price)}
                                        </span>

                                        <span
                                            className={`font-medium ${isCritical ? 'text-red-600' :
                                                    isLowStock ? 'text-orange-600' :
                                                        'text-gray-600'
                                                }`}>
                                            Stock: {product.stock}
                                            {isCritical && ' 🔴'}
                                            {isLowStock && !isCritical && ' ⚠️'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    className="text-red-600 hover:text-red-800 text-sm px-3 py-1 rounded hover:bg-red-50 transition-colors"
                                    onClick={() => handleDelete(product.id, product.name)}
                                >
                                    Eliminar Producto
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}