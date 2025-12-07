'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import ProductSearch from '../components/ProductSearch'
import Cart from '../components/Cart'
import CheckoutModal from '../components/CheckoutModal'
import { supabase, type Product, type CartItem } from '@/lib/supabase'
import { clearCart, calculateTotal } from '@/lib/cart-utils'

export default function VentaPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [virtualStock, setVirtualStock] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true })

    if (data) {
      setProducts(data)
      // Inicializar stock virtual con stock real
      const stockMap: Record<string, number> = {}
      data.forEach(p => {
        stockMap[p.id] = p.stock
      })
      setVirtualStock(stockMap)
    }
  }

  const getAvailableStock = (productId: string): number => {
    // Stock disponible = stock virtual - cantidad en carrito
    const cartItem = cart.find(item => item.product.id === productId)
    const inCart = cartItem?.quantity || 0
    return (virtualStock[productId] || 0) - inCart
  }

  const handleAddToCart = (product: Product) => {
    const available = getAvailableStock(product.id)
    
    if (available <= 0) {
      alert('❌ No hay stock disponible')
      return
    }

    const existingIndex = cart.findIndex(item => item.product.id === product.id)

    if (existingIndex >= 0) {
      // Ya existe - aumentar cantidad
      const updated = [...cart]
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1,
        subtotal: (updated[existingIndex].quantity + 1) * product.price
      }
      setCart(updated)
    } else {
      // Nuevo item
      setCart([
        ...cart,
        {
          product,
          quantity: 1,
          subtotal: product.price
        }
      ])
    }
  }

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remover del carrito
      setCart(cart.filter(item => item.product.id !== productId))
      return
    }

    const cartItem = cart.find(item => item.product.id === productId)
    if (!cartItem) return

    const maxStock = virtualStock[productId] || 0
    
    if (newQuantity > maxStock) {
      alert('❌ Stock insuficiente')
      return
    }

    setCart(cart.map(item =>
      item.product.id === productId
        ? {
            ...item,
            quantity: newQuantity,
            subtotal: item.product.price * newQuantity
          }
        : item
    ))
  }

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId))
  }

  const handleConfirmSale = async (paymentAmount: number) => {
    try {
      const total = calculateTotal(cart)

      // 1. Crear venta
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert([{ total }])
        .select()
        .single()

      if (saleError) throw saleError

      // 2. Crear items de venta
      const saleItems = cart.map(item => ({
        sale_id: sale.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
        subtotal: item.subtotal
      }))

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems)

      if (itemsError) throw itemsError

      // 3. Actualizar stock en DB
      for (const item of cart) {
        const newStock = virtualStock[item.product.id] - item.quantity

        const { error: stockError } = await supabase
          .from('products')
          .update({
            stock: newStock,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.product.id)

        if (stockError) throw stockError
      }

      // 4. Success
      alert(`✅ Venta exitosa\nTotal: $${total}\nPagó: $${paymentAmount}\nVuelto: $${paymentAmount - total}`)
      setCart(clearCart())
      setIsCheckoutOpen(false)
      
      // Refrescar productos para sincronizar
      await fetchProducts()
      
      router.push('/')
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error al procesar la venta')
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">💰 Nueva Venta</h2>
          <p className="text-gray-600">Busca productos y agrégalos al carrito</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search Products */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-bold text-lg mb-4">Productos Disponibles</h3>
              <ProductSearch 
                products={products}
                cart={cart}
                virtualStock={virtualStock}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg border p-6">
                <h3 className="font-bold text-lg mb-4">
                  Carrito ({cart.length})
                </h3>
                <Cart
                  cart={cart}
                  virtualStock={virtualStock}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveFromCart}
                  onCheckout={() => setIsCheckoutOpen(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        cart={cart}
        onConfirm={handleConfirmSale}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  )
}