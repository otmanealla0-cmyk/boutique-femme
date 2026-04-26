'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'

export default function ResendEmailButton({ orderId }: { orderId: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function resend() {
    setState('loading')
    try {
      const res = await fetch(`/api/admin/resend-email/${orderId}`, { method: 'POST' })
      setState(res.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
    setTimeout(() => setState('idle'), 3000)
  }

  return (
    <button
      onClick={resend}
      disabled={state === 'loading'}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-nude-medium rounded text-nude-dark hover:border-charcoal hover:text-charcoal transition-colors disabled:opacity-50"
    >
      <Mail size={13} />
      {state === 'loading' ? 'Envoi...' : state === 'done' ? '✓ Envoyé' : state === 'error' ? 'Erreur' : 'Renvoyer email'}
    </button>
  )
}
