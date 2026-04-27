'use client'

import { useState } from 'react'
import { Truck } from 'lucide-react'

export default function ShippingEmailButton({ orderId }: { orderId: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function send() {
    setState('loading')
    try {
      const res = await fetch(`/api/admin/shipping-email/${orderId}`, { method: 'POST' })
      setState(res.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
    setTimeout(() => setState('idle'), 4000)
  }

  return (
    <button
      onClick={send}
      disabled={state === 'loading'}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-blue-200 rounded text-blue-600 hover:border-blue-400 hover:text-blue-700 transition-colors disabled:opacity-50"
    >
      <Truck size={13} />
      {state === 'loading' ? 'Envoi...' : state === 'done' ? '✓ Envoyé' : state === 'error' ? 'Erreur' : 'Email expédition'}
    </button>
  )
}
