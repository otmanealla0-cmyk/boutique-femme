'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ChevronLeft, CreditCard, ArrowRight, Lock } from 'lucide-react'
import Image from 'next/image'

type Step = 'form' | 'payment'

export default function CheckoutPage() {
  const { items, total } = useCart()
  const router = useRouter()
  const [step, setStep] = useState<Step>('form')
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const PAYS_EUROPE = [
    'France', 'Belgique', 'Luxembourg', 'Allemagne', 'Espagne', 'Italie',
    'Portugal', 'Pays-Bas', 'Autriche', 'Pologne', 'Roumanie', 'Grèce',
    'Hongrie', 'République tchèque', 'Slovaquie', 'Slovénie', 'Croatie',
    'Bulgarie', 'Danemark', 'Finlande', 'Suède', 'Irlande', 'Lituanie',
    'Lettonie', 'Estonie', 'Chypre', 'Malte', 'Suisse',
  ]

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
  })

  useEffect(() => {
    if (items.length === 0) router.push('/boutique/panier')
  }, [items.length, router])

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
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
            bagSize: i.bagSize,
            withBox: i.withBox,
          })),
        }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) {
        toast.error('Erreur : ' + (orderData.error || orderRes.status))
        return
      }
      setOrderId(orderData.id)
      setStep('payment')
    } catch (err) {
      toast.error('Erreur réseau, veuillez réessayer.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handlePayWithPayPal() {
    if (!orderId) return
    setLoading(true)
    try {
      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error('Erreur PayPal : ' + (data.error || res.status))
        return
      }
      window.location.href = data.approvalUrl
    } catch (err) {
      toast.error('Erreur réseau, veuillez réessayer.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/boutique/panier" className="inline-flex items-center gap-1 text-nude-dark hover:text-charcoal text-sm mb-6">
        <ChevronLeft size={16} />
        Retour au panier
      </Link>

      {/* Stepper */}
      <div className="flex items-center gap-3 mb-8">
        <div className={`flex items-center gap-2 text-sm font-medium ${step === 'form' ? 'text-rose-deep' : 'text-nude-dark'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'form' ? 'bg-rose-deep text-white' : 'bg-green-500 text-white'}`}>
            {step === 'payment' ? '✓' : '1'}
          </span>
          Mes informations
        </div>
        <div className="flex-1 h-px bg-nude-medium" />
        <div className={`flex items-center gap-2 text-sm font-medium ${step === 'payment' ? 'text-rose-deep' : 'text-nude-dark'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'payment' ? 'bg-rose-deep text-white' : 'bg-nude-medium text-nude-dark'}`}>
            2
          </span>
          Paiement
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">

          {/* Étape 1 : Formulaire */}
          {step === 'form' && (
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
                <div>
                  <label className="label">Pays *</label>
                  <select className="input-field" value={form.country}
                    onChange={e => setForm(f => ({ ...f, country: e.target.value }))} required>
                    {PAYS_EUROPE.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {form.country === 'Suisse' && (
                    <p className="text-red-500 text-xs mt-1">⚠️ Nous ne livrons pas en Suisse.</p>
                  )}
                </div>
              </div>

              <button type="submit" disabled={loading || form.country === 'Suisse'}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-50">
                {loading
                  ? <span className="animate-spin">◌</span>
                  : <><ArrowRight size={18} /> Continuer vers le paiement</>}
              </button>
            </form>
          )}

          {/* Étape 2 : Choix du moyen de paiement */}
          {step === 'payment' && (
            <div className="card p-6 space-y-6">
              <h2 className="font-playfair text-lg font-semibold text-charcoal">Choisir un moyen de paiement</h2>

              <button
                onClick={handlePayWithPayPal}
                disabled={loading}
                className="w-full border-2 border-nude-medium hover:border-charcoal rounded-xl p-5 flex items-center justify-between transition-all disabled:opacity-50 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-10 flex items-center justify-center">
                    <Image src="/paypal-logo.png" alt="PayPal" width={64} height={40} className="object-contain" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-charcoal">PayPal</p>
                    <p className="text-xs text-nude-dark">Carte bancaire, compte PayPal</p>
                  </div>
                </div>
                {loading
                  ? <span className="animate-spin text-nude-dark">◌</span>
                  : <ArrowRight size={18} className="text-nude-dark group-hover:text-charcoal transition-colors" />}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-nude-dark pt-2">
                <Lock size={12} />
                Paiement 100% sécurisé
              </div>
            </div>
          )}
        </div>

        {/* Récapitulatif */}
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
