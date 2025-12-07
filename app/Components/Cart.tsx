'use client'

import { formatCurrency, type CartItem, formatStock } from '@/lib/supabase'
import { calculateTotal } from '@/lib/cart-utils'

type Props = {
    cart: CartItem[]
    virtualStock: Record<string, number>
    onUpdateQuantity: (productId: string, newQuantity: number) => void
    onRemove: (productId: string) => void
    onCheckout: () => void
}

export default function Cart({ cart, virtualStock, onUpdateQuantity, onRemove, onCheckout }: Props) {
    const total = calculateTotal(cart)

    if (cart.length === 0) {
        return (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-4xl mb-2">🛒</p>
                <p className="text-gray-600">Carrito vacío</p>
                <p className="text-sm text-gray-500 mt-1">Agrega productos para iniciar la venta</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Cart Items */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {cart.map((item) => {
                    const maxStock = virtualStock[item.product.id] || 0

                    return (
                        <div
                            key={item.product.id}
                            className="bg-white border rounded-lg p-4"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h4 className="font-semibold">{item.product.name}</h4>
                                    <p className="text-sm text-gray-600">
                                        {formatCurrency(item.product.price)} c/u
                                    </p>
                                </div>
                                <button
                                    onClick={() => onRemove(item.product.id)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            const decrement = item.product.unit === 'kg' ? 0.5 : 1
                                            onUpdateQuantity(item.product.id, item.quantity - decrement)
                                        }}
                                        className="w-8 h-8 rounded-lg border-2 hover:bg-gray-100 font-semibold"
                                    >
                                        −
                                    </button>
                                    <span className="w-12 text-center font-semibold">
                                        {item.product.unit === 'kg' ? item.quantity.toFixed(1) : item.quantity} {item.product.unit}
                                    </span>
                                    <button
                                        onClick={() => {
                                            const increment = item.product.unit === 'kg' ? 0.5 : 1
                                            onUpdateQuantity(item.product.id, item.quantity + increment)
                                        }}
                                        disabled={item.quantity >= maxStock}
                                        className="w-8 h-8 rounded-lg border-2 hover:bg-gray-100 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Subtotal */}
                                <span className="font-bold text-lg">
                                    {formatCurrency(item.subtotal)}
                                </span>
                            </div>

                            {/* Stock info */}
                            <p className="text-xs text-gray-500 mt-2">
                                Stock total: {formatStock(maxStock, item.product.unit)}
                            </p>
                        </div>
                    )
                })}
            </div>

            {/* Total */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-3xl font-bold">
                        {formatCurrency(total)}
                    </span>
                </div>

                <button
                    onClick={onCheckout}
                    className="w-full bg-white text-green-700 py-3 rounded-lg hover:bg-green-50 transition-colors font-bold text-lg"
                >
                    💰 Procesar Venta
                </button>
            </div>
        </div>
    )
}