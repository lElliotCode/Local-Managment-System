'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar';
import { supabase, formatCurrency, type Product } from '@/lib/supabase'
import SalesHistory from './components/SalesHistory';

type DashboardStats = {
  totalProducts: number
  lowStockProducts: number
  todaySales: number
  todaySalesCount: number
}

export default function Home() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    todaySales: 0,
    todaySalesCount: 0
  })
  const [loading, setLoading] = useState(false)
  const [lowStockItems, setLowStockItems] = useState<any[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {

    try {
      // Traemos el total de productos
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')

      if (productsError) throw productsError

      // Filtramos los productos con stock bajo
      const lowStock = products?.filter(p => p.stock <= p.low_stock_threshold) || []

      // Traemos las ventas del día
      const today = new Date().toISOString().split('T')[0]
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('total')
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)

      if (salesError) throw salesError

      const totalSales = sales?.reduce((sum, sale) => sum + sale.total, 0) || 0

      setStats({
        totalProducts: products?.length || 0,
        lowStockProducts: lowStock.length,
        todaySales: totalSales,
        todaySalesCount: sales?.length || 0
      })

      setLowStockItems(lowStock.slice(0, 5)) // A la vista los primeros 5 productos con bajo stock

    } catch (error) {
      console.error('Error fetching Dashboard Data: ', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-slate-50/50 font-sans '>
        <Navbar />
        <div className='max-w-7xl mx-auto px-4 py-8'>
          <div className='animate-pulse space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {[1, 2, 3].map(i => (
                <div key={i} className='h-32 bg-gray-200 rounded-lg'></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans ">
      <header className="sticky top-0 z-10">
        <div className="max-w-[80vw] mx-auto px-4 py-4 flex">
          <Navbar />
        </div>
      </header>

      <div className='max-w-[80vw] mx-auto px-12 py-8'>
        {/* Cards para las Stats */}
        <div className='grid gap-8 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] mb-8 mx-auto'>
          {/* Ventas del día */}
          <div className='bg-white border border-zinc-300 text-zinc-900 rounded-xl p-6 text-zinc-100 shadow-lg hover:shadow-xl transition-shadow'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-3xl opacity-90'>Ventas de hoy</span>
              <span className='text-4xl'>💰</span>
            </div>
            <div className='text-3xl font-bold mb-1'>
              {formatCurrency(stats.todaySales)}
            </div>
            <div className='text-sm opacity-90'>
              {stats.todaySalesCount} {stats.todaySalesCount === 1 ? 'venta' : 'ventas'}
            </div>
          </div>
          {/* Total de Productos */}
          <div className='bg-white border border-zinc-300 rounded-xl p-6 text-zinc-900 shadow-lg hover:shadow-xl transition-shadow'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-3xl opacity-90'>Productos</span>
              <span className='text-4xl'>📦</span>
            </div>
            <div className='text-3xl font-light mb-1'>
              {stats.totalProducts}
            </div>
            <div className='text-md opacity-90'>
              En inventario
            </div>
          </div>

          {/* Productos bajo Stock */}
          <div className={`bg-gradient-to-br ${stats.lowStockProducts > 0
            ? 'from-orange-100 to-orange-50'
            : 'white'
            } rounded-xl border border-zinc-300 p-6 text-zinc-900 shadow-lg hover:shadow-xl transition-shadow`}>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-3xl '>Bajo Stock</span>
              <span className='text-4xl'>⚠️</span>
            </div>
            <div className='text-3xl font-bold mb-1'>
              {stats.lowStockProducts}
            </div>
            <div className={`${stats.lowStockProducts === 0 ? 'text-sm opacity-90' : 'text-xl text-zinc-900 font-bold'}`}>
              {stats.lowStockProducts === 0 ? 'Todo OK' : 'Atención'}
            </div>
          </div>
        </div>
      </div>

      <div className='flex justify-center flex-col md:flex-row'>
        {/* Acciones principales */}
        <div className='px-12 py-8'>
          <div className='flex flex-col gap-4 min-w-[40vw]'>
            {/* Nueva venta - CTA Principal */}
            <button
              onClick={() => router.push('/venta')}
              className=' text-black bg-white rounded-lg  p-8 transition-all hover:shadow-xl hover:bg-white/80 cursor-pointer border border-zinc-200'
            >
              <div className='flex flex-col items-center gap-4 mb-4'>
                <span className='text-4xl'>💰</span>
                <div className='flex flex-col text-center'>
                  <h3 className='md:text-4xl font-bold'>Nueva venta</h3>
                  <small className='text-zinc-800 md:text-2xl'>Registrar venta rápida</small>
                </div>
              </div>
              <div className='text-right text-zinc-900'>
                Click para empezar →
              </div>
            </button>

            {/* Gestionar Inventario */}
            <button
              onClick={() => router.push('/inventario')}
              className='text-black bg-white rounded-lg p-8 transition-all hover:shadow-xl hover:bg-white/80 cursor-pointer border border-zinc-200 '
            >
              <div className='flex flex-col items-center  gap-4 mb-4'>
                <span className='text-4xl'>📦</span>
                <div className='flex flex-col text-center'>
                  <h3 className='md:text-4xl font-bold '>Inventario</h3>
                  <small className='text-zinc-800 md:text-2xl' >Gestionar productos y stock</small>
                </div>
              </div>
              <div className='text-right text-zinc-900 text-2xl font-light'>
                Ver inventario →
              </div>
            </button>
          </div>
        </div>

        {/* Alerta de lowStock */}
        <div className='px-12 py-8'>
          {stats.lowStockProducts > 0 && (
            <div className='bg-white border border-orange-200 rounded-lg p-6 '>
              <div className='flex items-start gap-3 mb-4'>
                <span className='text-2xl'>⚠️</span>
                <div>
                  <h3 className='font-bold text-orange-900 mb-1 text-2xl'>Productos con bajo stock</h3>
                  <p className='text-xl text-orange-700'>Los siguientes productos necesitan reposición</p>
                </div>
              </div>


              <div className='flex flex-col gap-4'>
                {lowStockItems.map(item => (
                  <div
                    key={item.id}
                    className='flex items-center justify-between bg-slate-50 rounded-xl border border-zinc-200 p-3 '
                  >
                    <div className='flex flex-col justify-start'>
                      <span className='font-semibold text-xl'>{item.name}</span>
                      {item.category && (
                        <span className='text-lg text-gray-500'>({item.category})</span>
                      )}
                    </div>

                    <div className='flex items-center gap-4'>
                      <span className={`font-bold text-lg ${item.stock <= 2 ? 'text-red-600' : 'text-orange-600'
                        }`}>
                        Stock: {item.stock}
                      </span>

                      <button
                        onClick={() => router.push('/inventario')}
                        className="text-blue-800 text-lg hover:bg-blue-200 p-2 rounded transition-all cursor-pointer"
                      >
                        Reponer →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {stats.lowStockProducts > 5 && (
                <button
                  onClick={() => router.push('/inventario')}
                  className='mt-3 text-sm text-orange-700 hover:text-orange-900 font-medium'
                >
                  Ver todos los {stats.lowStockProducts} productos →
                </button>
              )}
            </div>
          )
          }
        </div>
      </div>

      <div className='max-w-[80vw] mx-auto px-12 py-8 bg-white'>
        <div className='flex justify-between'>
          <h3 className='text-2xl'>Ultimas ventas</h3>
          <button className='rounded p-2 hover:bg-slate-50/50 cursor-pointer'>Ver todas →</button>
        </div>
        <div>
          <SalesHistory />
        </div>
      </div>
    </div >
  );
}
