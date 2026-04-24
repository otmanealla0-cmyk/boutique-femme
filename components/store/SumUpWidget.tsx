'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    SumUpCard: {
      mount: (config: {
        id: string
        checkoutId: string
        locale?: string
        showInstallments?: boolean
        onResponse?: (type: string, body: Record<string, unknown>) => void
      }) => void
      unmount: () => void
    }
  }
}

interface Props {
  checkoutId: string
  onSuccess: () => void
  onError: (msg: string) => void
}

export default function SumUpWidget({ checkoutId, onSuccess, onError }: Props) {
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) return
    mounted.current = true

    function mountWidget() {
      window.SumUpCard.mount({
        id: 'sumup-card',
        checkoutId,
        locale: 'fr-FR',
        showInstallments: false,
        onResponse: (type, body) => {
          if (type === 'success') {
            onSuccess()
          } else if (type === 'error' || type === 'fail') {
            onError((body?.message as string) || 'Paiement refusé')
          }
        },
      })
    }

    if (window.SumUpCard) {
      mountWidget()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js'
    script.async = true
    script.onload = mountWidget
    document.head.appendChild(script)

    return () => {
      try { window.SumUpCard?.unmount() } catch {}
    }
  }, [])

  return (
    <div>
      <p className="text-xs text-nude-dark text-center mb-4 animate-pulse">
        Chargement du module de paiement...
      </p>
      <div id="sumup-card" />
    </div>
  )
}
