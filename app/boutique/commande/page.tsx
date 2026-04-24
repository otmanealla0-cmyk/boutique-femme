'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ChevronLeft, CreditCard } from 'lucide-react'

export default function CheckoutPage() {
  const { items, total } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    postalCode: '',
  })

  useEffect(() => {
    if (items.length === 0) {
      router.push('/boutique/panier')
    }
  }, [items.length, router])

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const orderRes = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        items: items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        })),
      }),
    })

    if (!orderRes.ok) {
      toast.error('Erreur lors de la création de la commande')
      setLoading(false)
      return
    }

    const order = await orderRes.json()

    const checkoutRes = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: order.id }),
    })

    const checkoutData = await checkoutRes.json()

    if (!checkoutRes.ok) {
      toast.error(checkoutData.error || 'Erreur de paiement')
      setLoading(false)
      return
    }

    window.location.href = `https://pay.sumup.com/b2c/${checkoutData.checkoutId}`
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/boutique/panier" className="inline-flex items-center gap-1 text-nude-dark hover:text-charcoal text-sm mb-6">
        <ChevronLeft size={16} />
        Retour au panier
      </Link>

      <h1 className="text-2xl font-playfair text-charcoal mb-8">Finaliser la commande</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmitForm} className="space-y-6">
            <div className="card p-6 space-y-4">
              <h2 className="font-playfair text-lg font-semibold text-charcoal">Vos informations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Nom complet *</label>
                  <input className="input-field" placeholder="Marie Dupont"
                    value={form.customerName}
                    onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                    required />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input type="email" className="input-field" placeholder="marie@email.fr"
                    value={form.customerEmail}
                    onChange={e => setForm(f => ({ ...f, customerEmail: e.target.value }))}
                    required />
                </div>
              </div>
              <div>
                <label className="label">Téléphone</label>
                <input type="tel" className="input-field" placeholder="+33 6 00 00 00 00"
                  value={form.customerPhone}
                  onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))} />
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="font-playfair text-lg font-semibold text-charcoal">Adresse de livraison</h2>
              <div>
                <label className="label">Adresse *</label>
                <input className="input-field" placeholder="12 rue des Fleurs"
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Code postal *</label>
                  <input className="input-field" placeholder="75001"
                    value={form.postalCode}
                    onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))}
                    required />
                </div>
                <div>
                  <label className="label">Ville *</label>
                  <input className="input-field" placeholder="Paris"
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    required />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4">
              {loading
                ? <><span className="animate-spin">◌</span> Redirection vers le paiement...</>
                : <><CreditCard size={18} /> Payer maintenant</>}
            </button>
            <p className="text-center text-xs text-nude-dark">
              🔒 Paiement 100% sécurisé via SumUp — Carte bancaire & Apple Pay
            </p>
          </form>
        </div>

        <div className="card p-6 h-fit sticky top-24">
          <h2 className="font-playfair text-lg font-semibold text-charcoal mb-4">Ma commande</h2>
          <div className="space-y-3 mb-4">
            {items.map(item => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium text-charcoal truncate max-w-[140px]">{item.name}</p>
                  <p className="text-nude-dark text-xs">
                    {[item.size, item.color].filter(Boolean).join(' · ')} ×{item.quantity}
                  </p>
                </div>
                <p className="text-charcoal font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
              </div>
            ))}
          </div>
          <div className="border-t border-nude-medium pt-4">
            <div className="flex justify-between font-playfair font-bold text-charcoal">
              <span>Total</span>
              <span className="text-rose-deep">{total.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
