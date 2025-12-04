'use client'
import { useState } from "react";
import ProductForm from "./Components/ProductForm";

export default function Home() {

  const [refreshTrigger, setRefreshTrigger] = useState(0)


  const onSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  return (
    <main className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <header className="border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 ">
          <h1 className="text-xl text-zinc-100">🏪 Stock & Sales Managment</h1>
          <p className="text-gray-300 text-sm">Sistema de gestión para el local de Mauro</p>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* { Sidebar - Formulario} */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ProductForm onSuccess={onSuccess}/>
            </div>
          </div>

          <div className="lg:col-span-2">

          </div>
        </div>
      </div>
    </main>
  );
}
