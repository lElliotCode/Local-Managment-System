import type { Product, CartItem } from './supabase'

export const addToCart = (
    cart: CartItem[],
    product: Product,
    quantity: number = 1
): CartItem[] => {

    
    const existingIndex = cart.findIndex(item => item.product.id === product.id)

    if (existingIndex !== -1) {
        // Producto existente, actualizamos la cantidad
        const updated = [...cart]
        updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
            subtotal: (updated[existingIndex].quantity + quantity ) * product.price
        }
        return updated
    } 
    return [
        ...cart,
        {
            product,
            quantity,
            subtotal: product.price * quantity
        }
    ]
}

export const updateCartQuantity = (
    cart: CartItem[],
    productId: string,
    newQuantity: number
): CartItem[] => {
    if(newQuantity <= 0) {
        return cart.filter(item => item.product.id !== productId)
    }

    return cart.map(item => item.product.id === productId 
        ? {
            ...item,
            quantity: newQuantity,
            subtotal: item.product.price * newQuantity
        }
        : item
    )
}

export const removeFromCart = (
    cart: CartItem[],
    productId: string
): CartItem[] => {
    return cart.filter(item => item.product.id !== productId)
}

export const calculateTotal = (cart: CartItem[]): number => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0)
}

export const clearCart = (): CartItem[] => {
    return []
}