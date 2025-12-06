'use client'
import { useState } from "react";
import ProductForm from "./Components/AddProductModal";
import ProductList from "./Components/ProductList"
import Navbar from "./Components/Navbar";

export default function Home() {

  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)


  const onSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  return (
    <main className="min-h-screen bg-slate-50/50 font-sans ">
      <header className="border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex">
          <Navbar />
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">


          <div className="lg:col-span-2 p-4 rounded-xl">
            <ProductList refreshTrigger={refreshTrigger}/>
          </div>
        </div>
      </div>
    </main>
  );
}
