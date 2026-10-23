'use client'

import { useState } from 'react'
import { Search, Package, Truck, CheckCircle, Clock, X } from 'lucide-react'

type OrderStatus = 'pending' | 'paid' | 'preparation' | 'shipped' | 'delivered' | 'cancelled'

interface TrackingResult {
  orderNumber: string
  status: OrderStatus
  customerName: string
  city: string
  country: string
  createdAt: string
  updatedAt: string
}

const STEPS = [
  {
    key: ['paid', 'preparation'],
    label: 'En préparation',
    desc: 'Votre commande est en cours de préparation',
    icon: Package,
    color: 'bg-amber-500',
  },
  {
    key: ['shipped'],
    label: 'En expédition',
    desc: 'Votre commande a été expédiée',
    icon: Truck,
    color: 'bg-blue-500',
  },
  {
    key: ['delivered'],
    label: 'Livrée',
    desc: 'Votre commande a été livrée',
    icon: CheckCircle,
    color: 'bg-green-500',
  },
]

function getStepIndex(status: OrderStatus): number {
  if (status === 'paid' || status === 'preparation') return 0
  if (status === 'shipped') return 1
  if (status === 'delivered') return 2
  return -1
}

export default function SuiviCommandePage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [result, setResult] = useState<TrackingResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!orderNumber.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber.trim())}`)
    const data = await res.json()

    if (!res.ok) {
      setError('Commande introuvable. Vérifiez votre numéro de commande.')
    } else {
      setResult(data)
    }
    setLoading(false)
  }

  const stepIndex = result ? getStepIndex(result.status) : -1
  const isCancelled = result?.status === 'cancelled'
  const isPending = result?.status === 'pending'

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-playfair text-charcoal mb-2">Suivi de commande</h1>
        <p className="text-nude-dark text-sm">Entrez votre numéro de commande pour suivre votre colis</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          className="input-field flex-1"
          placeholder="Ex : CMD-12345678"
          value={orderNumber}
          onChange={e => setOrderNumber(e.target.value.toUpperCase())}
          required
        />
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-5 disabled:opacity-50">
          {loading ? <span className="animate-spin">◌</span> : <Search size={16} />}
          Rechercher
        </button>
      </form>

      {error && (
        <div className="card p-4 flex items-center gap-3 text-red-600 border-red-200 bg-red-50">
          <X size={18} className="flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="card p-6 animate-fade-in-up">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs text-nude-dark uppercase tracking-widest mb-1">Commande</p>
              <p className="font-playfair font-bold text-charcoal text-lg">{result.orderNumber}</p>
              <p className="text-sm text-nude-dark mt-0.5">{result.customerName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-nude-dark">Passée le</p>
              <p className="text-sm text-charcoal">
                {new Date(result.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {isCancelled ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-sm text-red-600">
              <X size={20} />
              <p className="font-medium">Commande annulée</p>
            </div>
          ) : isPending ? (
            <div className="flex items-center gap-3 p-4 bg-nude-base rounded-sm text-nude-dark">
              <Clock size={20} />
              <p className="font-medium">En attente de paiement</p>
            </div>
          ) : (
            <div className="space-y-0">
              {STEPS.map((step, i) => {
                const isCompleted = i <= stepIndex
                const isCurrent = i === stepIndex
                const Icon = step.icon

                return (
                  <div key={i} className="flex gap-4">
                    {/* Ligne verticale */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isCompleted ? step.color : 'bg-nude-medium'
                      }`}>
                        <Icon size={18} className={isCompleted ? 'text-white' : 'text-nude-dark'} />
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`w-0.5 h-10 my-1 transition-all ${i < stepIndex ? 'bg-green-400' : 'bg-nude-medium'}`} />
                      )}
                    </div>

                    {/* Contenu */}
                    <div className={`pb-6 ${i < STEPS.length - 1 ? '' : ''}`}>
                      <p className={`font-medium text-sm ${isCompleted ? 'text-charcoal' : 'text-nude-dark'}`}>
                        {step.label}
                        {isCurrent && (
                          <span className="ml-2 text-xs bg-rose-deep text-white px-2 py-0.5 rounded-full">En cours</span>
                        )}
                      </p>
                      <p className={`text-xs mt-0.5 ${isCompleted ? 'text-nude-dark' : 'text-nude-medium'}`}>
                        {step.desc}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-nude-dark mt-1">
                          Mis à jour le {new Date(result.updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      <p className="text-center text-xs text-nude-dark mt-8">
        Votre numéro de commande se trouve dans l&apos;email de confirmation reçu après votre achat.
      </p>
    </div>
  )
}
