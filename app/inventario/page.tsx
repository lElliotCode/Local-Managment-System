'use client'

import { useState } from "react"
import Navbar from "../Components/Navbar"
import ProductList from "../Components/ProductList"
import AddProductModal from "../Components/AddProductModal"

export default function InventarioPage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleProductAdded = () => {
        setRefreshTrigger(prev => prev + 1)
    }

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans">
            <header className="sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex">
                    <Navbar />
                </div>
            </header>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col gap-4 text-center md:flex-row items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Inventario de Productos</h2>
                        <p className="text-gray-600">Gestiona el stock y los precios</p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}

                        className="cursor-pointer bg-zinc-900 text-white px-6 py-3 rounded-lg hover:bg-zinc-800 transition-colors font-semibold shadow-lg"
                    >
                        + Agregar un producto
                    </button>
                </div>

                <ProductList refreshTrigger={refreshTrigger}/>
            </div>
            <AddProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleProductAdded}
            />
        </div>
    )
}