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
        onLoad?: () => void
        onPaymentMethodsLoad?: () => void
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

    const script = document.createElement('script')
    script.src = 'https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js'
    script.async = true

    script.onload = () => {
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

    document.body.appendChild(script)

    return () => {
      if (window.SumUpCard) window.SumUpCard.unmount()
      document.body.removeChild(script)
    }
  }, [checkoutId, onSuccess, onError])

  return (
    <div>
      <div id="sumup-card" className="min-h-[320px]">
        <div className="flex items-center justify-center h-40 gap-3 text-nude-dark text-sm">
          <span className="animate-spin text-rose-deep">◌</span>
          Chargement du paiement...
        </div>
      </div>
    </div>
  )
}
