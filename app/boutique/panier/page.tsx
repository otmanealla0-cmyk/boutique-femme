'use client'

import { useCart } from '@/lib/cart'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const { items, remove, update, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={60} className="mx-auto text-nude-medium mb-6" />
        <h1 className="text-3xl font-playfair text-charcoal mb-3">Votre panier est vide</h1>
        <p className="text-nude-dark mb-8">Découvrez nos articles et ajoutez-en à votre panier</p>
        <Link href="/boutique/produits" className="btn-primary inline-flex items-center gap-2">
          Découvrir la boutique
          <ArrowRight size={18} />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-playfair text-charcoal mb-6 md:mb-8">Mon panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="card p-5 flex gap-4">
              <div className="w-20 h-24 rounded-xl bg-nude-base overflow-hidden flex-shrink-0 relative">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">👗</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-charcoal truncate">{item.name}</h3>
                <div className="flex gap-2 mt-1">
                  {item.size && <span className="badge bg-nude-base text-charcoal">{item.size}</span>}
                  {item.color && <span className="badge bg-nude-base text-charcoal">{item.color}</span>}
                </div>
                <p className="font-playfair font-bold text-rose-deep mt-2">{item.price.toFixed(2)} €</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => update(item.productId, item.size, item.color, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-nude-base hover:bg-nude-medium flex items-center justify-center"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => update(item.productId, item.size, item.color, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-nude-base hover:bg-nude-medium flex items-center justify-center"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => remove(item.productId, item.size, item.color)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-4 md:p-6 h-fit lg:sticky lg:top-20">
          <h2 className="font-playfair text-lg font-semibold text-charcoal mb-5">Récapitulatif</h2>
          <div className="space-y-3 mb-5">
            {items.map(item => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between text-sm text-charcoal">
                <span className="truncate pr-2">{item.name} ×{item.quantity}</span>
                <span className="flex-shrink-0">{(item.price * item.quantity).toFixed(2)} €</span>
              </div>
            ))}
          </div>
          <div className="border-t border-nude-medium pt-4 mb-5">
            <div className="flex justify-between font-playfair font-bold text-charcoal text-lg">
              <span>Total</span>
              <span className="text-rose-deep">{total.toFixed(2)} €</span>
            </div>
          </div>
          <Link href="/boutique/commande" className="btn-primary w-full flex items-center justify-center gap-2">
            Commander
            <ArrowRight size={18} />
          </Link>
          <Link href="/boutique/produits" className="btn-ghost w-full text-center mt-3 text-sm">
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  )
}
