'use client'

import { useCart } from '@/lib/cart'
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, remove, update, total, count } = useCart()

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-nude-medium">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-charcoal" />
            <span className="font-playfair font-semibold text-charcoal">Mon panier</span>
            {count > 0 && (
              <span className="bg-rose-deep text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-nude-base rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} className="text-nude-medium" />
              <p className="text-nude-dark">Votre panier est vide</p>
              <button onClick={onClose} className="btn-primary text-sm px-6 py-2">
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3 py-3 border-b border-nude-light last:border-0">
                  <div className="w-16 h-20 bg-nude-base rounded-sm overflow-hidden flex-shrink-0 relative">
                    {item.image
                      ? <Image src={item.image} alt={item.name} fill className="object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-xl">👗</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal text-sm truncate">{item.name}</p>
                    <div className="flex gap-1 mt-0.5">
                      {item.size && <span className="text-xs text-nude-dark">{item.size}</span>}
                      {item.size && item.color && <span className="text-xs text-nude-dark">·</span>}
                      {item.color && <span className="text-xs text-nude-dark">{item.color}</span>}
                    </div>
                    <p className="text-rose-deep font-semibold text-sm mt-1">{item.price.toFixed(2)} €</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => update(item.productId, item.size, item.color, item.quantity - 1, item.bagSize, item.withBox)}
                          className="w-6 h-6 rounded-full bg-nude-base hover:bg-nude-medium flex items-center justify-center transition-colors"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => update(item.productId, item.size, item.color, item.quantity + 1, item.bagSize, item.withBox)}
                          className="w-6 h-6 rounded-full bg-nude-base hover:bg-nude-medium flex items-center justify-center transition-colors"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.productId, item.size, item.color, item.bagSize, item.withBox)}
                        className="p-1 text-red-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-nude-medium space-y-3">
            <div className="flex justify-between font-playfair font-bold text-charcoal">
              <span>Total</span>
              <span className="text-rose-deep">{total.toFixed(2)} €</span>
            </div>
            <Link
              href="/boutique/commande"
              onClick={onClose}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Commander <ArrowRight size={16} />
            </Link>
            <button
              onClick={onClose}
              className="w-full text-center text-sm text-nude-dark hover:text-charcoal transition-colors"
            >
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </>
  )
}
