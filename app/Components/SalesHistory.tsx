'use client'

import { useEffect, useState } from 'react'
import { supabase, formatCurrency, type Sale } from '@/lib/supabase'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function SalesHistory() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setSales(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Cargando...</div>

  if (sales.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-4xl mb-2">💰</p>
        <p>No hay ventas registradas aún</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sales.map((sale) => (
        <div key={sale.id} className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {format(new Date(sale.created_at), "d 'de' MMMM, HH:mm", { locale: es })}
              </p>
            </div>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(sale.total)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}