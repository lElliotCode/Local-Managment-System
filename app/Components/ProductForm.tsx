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
    const [loading, setLoading] = useState(false)

    return (
        <form>
            <h3>Agregar Producto</h3>

            <div>
                <label >
                    Nombre del Producto *
                </label>
                <input
                    type="text"
                    placeholder="Ej: Coca Cola 2.25lt"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">

                <div>
                    <label>
                        Precio *
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min='0'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Ej: Coca Cola 2.25lt"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <label>
                        Precio *
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min='0'
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="Ej: Coca Cola 2.25lt"
                        required
                    />
                </div>
            </div>

            <div>
                <label >
                    Categoría (opcional)
                </label>
                <input 
                    type="text" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
            </div>

            <button>
                {loading ? '⏳ Agregando...' : '+ Agregar Producto'}
            </button>
        </form>
    )
}