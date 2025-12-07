'use client'

import { useState } from "react"
import { supabase, CATEGORIES } from "@/lib/supabase"

type Props = {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function AddProductModal({ isOpen, onClose, onSuccess }: Props) {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [stock, setStock] = useState('')
    const [category, setCategory] = useState('')
    const [lowStock, setLowStock] = useState('5')
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const selectedCategory = CATEGORIES.find(c => c.name === category)
    const unit = selectedCategory?.unit || 'unidad'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from('products')
                .insert([{
                    name,
                    category,
                    unit,
                    price: parseFloat(price),
                    stock: parseFloat(stock), // parseFloat para soportar decimales (kg)
                    low_stock_threshold: unit === 'kg' ? 1 : 5 // Threshold según unidad
                }])

            // Reseteamos el form

            setName('')
            setPrice('')
            setStock('')
            setCategory(CATEGORIES[0].name)

            if (error) throw error

            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error adding Product: ', error)
            alert('Error adding Product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-10 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg max-w-xl w-full p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Agregar Producto</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
                    >
                        X
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-lg border p-6 space-y-4 "
                >

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
                                Precio por {unit === 'kg' ? 'kg' : 'unidad'} *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                placeholder="3500"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Categoría *
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.name} value={cat.name}>
                                        {cat.name} (se mide en {cat.unit === 'kg' ? 'kilogramos' : 'unidades'})
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                📦 Este producto se medirá en <strong>{unit === 'kg' ? 'kilogramos' : 'unidades'}</strong>
                            </p>
                        </div>

                        <div className="">
                            <label className="block text-sm font-medium mb-1">
                                Stock ({unit}) *
                            </label>
                            <input
                                type="number"
                                step={unit === 'kg' ? '0.1' : '1'}
                                min="0"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                required
                                placeholder={unit === 'kg' ? '25.5' : '50'}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg flex justify-center items-center text-center">
                            <p className="text-sm text-blue-800">
                                💡 <strong>Tip:</strong> {
                                    unit === 'kg'
                                        ? 'Puedes usar decimales (ej: 2.5 kg)'
                                        : 'Stock en unidades completas'
                                }
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm block font-medium mb-1">
                            Advertencia de poco stock
                        </label>
                        <input
                            type="number"
                            min='0'
                            value={lowStock}
                            onChange={(e) => setLowStock(e.target.value)}
                            placeholder="50"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        className="w-full cursor-pointer bg-zinc-900 text-white py-3 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                        disabled={loading}
                        type="submit"
                    >
                        {loading ? '⏳ Agregando...' : '+ Agregar Producto'}
                    </button>
                </form>
            </div>
        </div>
    )
}