'use client'

import { useEffect, useRef, useState } from 'react'

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
  const [widgetError, setWidgetError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (mounted.current) return
    mounted.current = true

    const existingScript = document.getElementById('sumup-sdk')
    if (existingScript) {
      tryMount()
      return
    }

    const script = document.createElement('script')
    script.id = 'sumup-sdk'
    script.src = 'https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js'
    script.async = true

    script.onload = () => tryMount()
    script.onerror = () => {
      setWidgetError('Impossible de charger le module de paiement. Vérifiez votre connexion.')
    }

    document.head.appendChild(script)

    return () => {
      try {
        if (window.SumUpCard) window.SumUpCard.unmount()
      } catch {}
    }
  }, [checkoutId])

  function tryMount() {
    if (!window.SumUpCard) {
      setWidgetError('Module de paiement non disponible. Rechargez la page.')
      return
    }

    try {
      window.SumUpCard.mount({
        id: 'sumup-card',
        checkoutId,
        locale: 'fr-FR',
        showInstallments: false,
        onLoad: () => setLoaded(true),
        onResponse: (type, body) => {
          if (type === 'success') {
            onSuccess()
          } else if (type === 'error' || type === 'fail') {
            onError((body?.message as string) || 'Paiement refusé')
          }
        },
      })
    } catch (e) {
      setWidgetError('Erreur lors du chargement du paiement. Rechargez la page.')
    }
  }

  if (widgetError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-sm mb-4">{widgetError}</p>
        <button
          onClick={() => { mounted.current = false; setWidgetError(null); window.location.reload() }}
          className="btn-primary text-sm"
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div>
      {!loaded && (
        <div className="flex items-center justify-center h-40 gap-3 text-nude-dark text-sm">
          <span className="animate-spin text-rose-deep">◌</span>
          Chargement du paiement...
        </div>
      )}
      <div id="sumup-card" className={loaded ? '' : 'hidden'} />
    </div>
  )
}
