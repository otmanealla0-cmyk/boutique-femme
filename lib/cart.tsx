'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (productId: string, size: string, color: string) => void
  update: (productId: string, size: string, color: string, quantity: number) => void
  clear: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('boutique-cart')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('boutique-cart', JSON.stringify(items))
  }, [items])

  function key(item: Pick<CartItem, 'productId' | 'size' | 'color'>) {
    return `${item.productId}-${item.size}-${item.color}`
  }

  function add(item: CartItem) {
    setItems(prev => {
      const existing = prev.find(i => key(i) === key(item))
      if (existing) {
        return prev.map(i => key(i) === key(item) ? { ...i, quantity: i.quantity + item.quantity } : i)
      }
      return [...prev, item]
    })
  }

  function remove(productId: string, size: string, color: string) {
    setItems(prev => prev.filter(i => key(i) !== key({ productId, size, color })))
  }

  function update(productId: string, size: string, color: string, quantity: number) {
    if (quantity <= 0) return remove(productId, size, color)
    setItems(prev => prev.map(i => key(i) === key({ productId, size, color }) ? { ...i, quantity } : i))
  }

  function clear() { setItems([]) }

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, add, remove, update, clear, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
