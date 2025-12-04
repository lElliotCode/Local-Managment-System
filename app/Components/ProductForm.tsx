'use client'

import { useState } from "react"
import { supabase } from "@/lib/supabase"

type Props = {
    onSuccess?: () => void
}

export default function ProductForm({ onSuccess }: Props) {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [stock, setStock] = useState('')
    const [category, setCategory] = useState('')
    const [lowStock, setLowStock] = useState('5')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from('products')
                .insert([{ name, price, stock, category }])

            // Reseteamos el form

            setName('')
            setPrice('')
            setStock('')
            setCategory('')

            onSuccess?.()
        } catch (error) {
            console.error('Error adding Product: ', error)
            alert('Error adding Product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg border p-6 space-y-4 "
        >
            <h3 className="text-xl font-bold">Agregar Producto</h3>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Nombre del Producto *
                </label>
                <input
                    type="text"
                    placeholder="Ej: Coca Cola 2.25lt"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">

                <div className="">
                    <label className="block text-sm font-medium mb-1">
                        Precio *
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min='0'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="3500"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="">
                    <label className="block text-sm font-medium mb-1">
                        Stock Inicial *
                    </label>
                    <input
                        type="number"
                        min='0'
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="50"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="text-sm block font-medium mb-1">
                    Advertencia de poco stock
                </label>
                <input
                        type="number"
                        min='5'
                        value={lowStock}
                        onChange={(e) => setLowStock(e.target.value)}
                        placeholder="50"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Categoría (opcional)
                </label>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                disabled={loading}
                type="submit"
            >
                {loading ? '⏳ Agregando...' : '+ Agregar Producto'}
            </button>
        </form>
    )
}