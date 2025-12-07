'use client'

import { useState } from 'react'
import { formatCurrency, type CartItem } from '@/lib/supabase'
import { calculateTotal } from '@/lib/cart-utils'

type Props = {
    isOpen: boolean
    cart: CartItem[]
    onConfirm: (paymentAmount: number) => Promise<void>
    onClose: () => void
}

export default function CheckoutModal({ isOpen, cart, onConfirm, onClose }: Props) {
    const [paymentAmount, setPaymentAmount] = useState('')
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const total = calculateTotal(cart)
    const payment = parseFloat(paymentAmount) || 0
    const change = payment - total

    const handleConfirm = async () => {
        if (payment < total) {
            alert('❌ El monto pagado es insuficiente')
            return
        }

        setLoading(true)
        try {
            await onConfirm(payment)
        } catch (error) {
            console.error('Error con el pago: ', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">Confirmar Venta</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                {/* Total */}
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-green-700 mb-1">Total a cobrar</p>
                    <p className="text-3xl font-bold text-green-700">
                        {formatCurrency(total)}
                    </p>
                </div>

                {/* Payment Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                        ¿Con cuánto paga el cliente?
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="999999999" // Límite razonable
                        value={paymentAmount}
                        onChange={(e) => {
                            const value = parseFloat(e.target.value)
                            if (value > 999999) {
                                setPaymentAmount('999999')
                            } else {
                                setPaymentAmount(e.target.value)
                            }
                        }}
                        placeholder="0"
                        className="w-full px-4 py-3 text-2xl text-center border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        autoFocus
                    />
                </div>

                {/* Change */}
                {payment >= total && payment > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-700 mb-1">Vuelto</p>
                        <p className="text-3xl font-bold text-blue-700">
                            {formatCurrency(change)}
                        </p>
                    </div>
                )}

                {/* Validation Message */}
                {payment > 0 && payment < total && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-center">
                        <p className="text-red-700 font-medium">
                            ❌ Falta {formatCurrency(total - payment)}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-3 border-2 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading || payment < total}
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '⏳ Procesando...' : '✓ Confirmar Venta'}
                    </button>
                </div>
            </div>
        </div>
    )
}