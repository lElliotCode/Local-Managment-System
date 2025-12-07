"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"

export default function MobileSidebar() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <>
            {/* Botón hamburguesa */}
            <button
                onClick={() => setOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Overlay oscurecido */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white z-50 p-6 shadow-xl transform transition-transform duration-300
                ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
                >
                    ✖
                </button>

                <h2 className="font-bold text-xl mb-6">Menú</h2>

                <nav className="flex flex-col gap-3">
                    <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className={`px-4 py-2 rounded-lg ${
                            isActive("/")
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-100"
                        }`}
                    >
                        📊 Dashboard
                    </Link>

                    <Link
                        href="/inventario"
                        onClick={() => setOpen(false)}
                        className={`px-4 py-2 rounded-lg ${
                            isActive("/inventario")
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-100"
                        }`}
                    >
                        📦 Inventario
                    </Link>

                    <Link
                        href="/venta"
                        onClick={() => setOpen(false)}
                        className={`px-4 py-2 rounded-lg ${
                            isActive("/venta")
                                ? "bg-green-600 text-white"
                                : "hover:bg-gray-100"
                        }`}
                    >
                        💰 Nueva Venta
                    </Link>
                </nav>
            </aside>
        </>
    )
}
