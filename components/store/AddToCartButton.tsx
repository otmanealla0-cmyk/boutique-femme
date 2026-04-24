'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart'
import toast from 'react-hot-toast'
import { ShoppingBag } from 'lucide-react'

interface Props {
  product: {
    id: string
    name: string
    price: number
    image: string
    sizes: string[]
    colors: string[]
    stock: number
  }
}

export default function AddToCartButton({ product }: Props) {
  const { add } = useCart()
  const [size, setSize] = useState(product.sizes[0] || '')
  const [color, setColor] = useState(product.colors[0] || '')
  const [qty, setQty] = useState(1)

  function handleAdd() {
    if (product.stock === 0) return toast.error('Produit épuisé')
    add({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
      color,
      quantity: qty,
    })
    toast.success('Ajouté au panier !')
  }

  if (product.stock === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-2xl text-center text-gray-500 font-medium">
        Produit épuisé
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {product.sizes.length > 0 && (
        <div>
          <p className="label">Taille</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                  size === s
                    ? 'bg-charcoal border-charcoal text-white'
                    : 'border-nude-medium text-charcoal hover:border-charcoal'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colors.length > 0 && (
        <div>
          <p className="label">Couleur</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                  color === c
                    ? 'bg-rose-deep border-rose-deep text-white'
                    : 'border-nude-medium text-charcoal hover:border-rose-soft'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="label">Quantité</p>
        <div className="flex items-center gap-3 w-fit">
          <button
            onClick={() => setQty(q => Math.max(1, q - 1))}
            className="w-9 h-9 rounded-full bg-nude-base hover:bg-nude-medium text-charcoal font-bold transition-colors"
          >
            −
          </button>
          <span className="w-8 text-center font-medium text-charcoal">{qty}</span>
          <button
            onClick={() => setQty(q => Math.min(product.stock, q + 1))}
            className="w-9 h-9 rounded-full bg-nude-base hover:bg-nude-medium text-charcoal font-bold transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <button onClick={handleAdd} className="btn-primary w-full flex items-center justify-center gap-2">
        <ShoppingBag size={18} />
        Ajouter au panier — {(product.price * qty).toFixed(2)} €
      </button>
    </div>
  )
}
