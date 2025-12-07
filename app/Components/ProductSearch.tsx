'use client'

import { useState, useEffect } from 'react'
import { formatCurrency, type Product, type CartItem, formatStock } from '@/lib/supabase'

type Props = {
  products: Product[]
  cart: CartItem[]
  virtualStock: Record<string, number>
  onAddToCart: (product: Product) => void
}

export default function ProductSearch({ products, cart, virtualStock, onAddToCart }: Props) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchQuery, products])

  const getAvailableStock = (productId: string): number => {
    const cartItem = cart.find(item => item.product.id === productId)
    const inCart = cartItem?.quantity || 0
    return (virtualStock[productId] || 0) - inCart
  }

  const handleAdd = (product: Product) => {
    const available = getAvailableStock(product.id)
    
    if (available <= 0) {
      alert('❌ No hay stock disponible')
      return
    }
    
    onAddToCart(product)
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="🔍 Buscar producto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">
            {searchQuery ? (
              <>
                <p className="text-4xl mb-2">🔍</p>
                <p>No se encontró "{searchQuery}"</p>
              </>
            ) : (
              <>
                <p className="text-4xl mb-2">📦</p>
                <p>No hay productos disponibles</p>
              </>
            )}
          </div>
        ) : (
          filteredProducts.map((product) => {
            const availableStock = getAvailableStock(product.id)
            const isOutOfStock = availableStock <= 0
            const isLowStock = availableStock <= product.low_stock_threshold

            return (
              <button
                key={product.id}
                onClick={() => handleAdd(product)}
                disabled={isOutOfStock}
                className={`text-left border-2 rounded-lg p-4 transition-all bg-white ${
                  isOutOfStock 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:border-blue-500 hover:shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    {product.category && (
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        {product.category}
                      </span>
                    )}
                  </div>
                  <span className="text-xl">{isOutOfStock ? '🚫' : '➕'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(product.price)}
                  </span>
                  <span className={`text-sm font-medium ${
                    isOutOfStock ? 'text-red-600' :
                    isLowStock ? 'text-orange-600' : 
                    'text-gray-600'
                  }`}>
                    Disponible: {formatStock(availableStock, product.unit)}
                    {isLowStock && !isOutOfStock && ' ⚠️'}
                    {isOutOfStock && ' 🔴'}
                  </span>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}