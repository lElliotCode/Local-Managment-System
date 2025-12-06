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
            <Navbar />

            <div>
                <div>
                    <div>
                        <h2>Inventario de Productos</h2>
                        <p>Gestiona tu stock y precios</p>
                    </div>

                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
                    >
                        + Agregar un producto
                    </button>
                </div>

                <ProductList />
            </div>
            <AddProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleProductAdded}
            />
        </div>
    )
}