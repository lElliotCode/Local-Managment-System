'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import MobileSidebar from "./MobileSideBar"

export default function Navbar() {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <nav className="bg-white w-full sticky top-0 z-50">

            <div className=" mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div> {/*SVG casita */}
                            <div
                                data-source-location="Layout:58:14"
                                data-dynamic-content="false"
                                className="w-10 h-10 bg-slate-900 text-slate-50 rounded-xl flex items-center justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    data-source-location="Layout:59:16"
                                    data-dynamic-content="false"
                                >
                                    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
                                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
                                    <path d="M2 7h20"></path>
                                    <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"></path>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h1 className="font-bold">Stock & Ventas</h1>
                            <p className="text-xs text-gray-500">Sistema de gestión</p>
                        </div>
                    </Link>

                    <div className="md:hidden">
                        <MobileSidebar />
                    </div>

                    <div className="hidden md:flex gap-2">
                        <Link
                            href="/"
                            className={`px-4 py-2 rounded-lg transition-colors ${isActive('/')
                                ? 'bg-blue-600 text-white'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            📊 Dashboard
                        </Link>

                        <Link
                            href="/inventario"
                            className={`px-4 py-2 rounded-lg transition-colors ${isActive('/inventario')
                                ? 'bg-blue-600 text-white'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            📦 Inventario
                        </Link>

                        <Link
                            href="/venta"
                            className={`px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-semibold ${isActive('/venta') ? 'ring-2 ring-green-300' : ''
                                }`}
                        >
                            💰 Nueva Venta
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}