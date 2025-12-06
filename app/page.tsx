'use client'
import { useState } from "react";
import ProductForm from "./Components/ProductForm";
import ProductList from "./Components/ProductList"

export default function Home() {

  const [refreshTrigger, setRefreshTrigger] = useState(0)


  const onSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  return (
    <main className="min-h-screen bg-slate-50/50 font-sans ">
      <header className="border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex">
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
          <div className=" px-4">
            <h1 className="text-xl text-zinc-900">Stock & Sales Managment</h1>
            <p className="text-zinc-400 text-sm">Sistema de gestión para el local de Mauro</p>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* { Sidebar - Formulario} */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ProductForm onSuccess={onSuccess} />
            </div>
          </div>

          <div className="lg:col-span-2 p-4 rounded-xl">
            <ProductList refreshTrigger={refreshTrigger}/>
          </div>
        </div>
      </div>
    </main>
  );
}
