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
  const didMount = useRef(false)

  useEffect(() => {
    if (didMount.current) return

    function mount() {
      didMount.current = true
      window.SumUpCard.mount({
        id: 'sumup-card',
        checkoutId,
        locale: 'fr-FR',
        showInstallments: false,
        onResponse: (type, body) => {
          if (type === 'success') onSuccess()
          else if (type === 'error' || type === 'fail')
            onError((body?.message as string) || 'Paiement refusé')
        },
      })
    }

    if (window.SumUpCard) {
      mount()
    } else {
      const interval = setInterval(() => {
        if (window.SumUpCard) {
          clearInterval(interval)
          mount()
        }
      }, 200)
      return () => clearInterval(interval)
    }
  }, [checkoutId])

  return (
    <div
      id="sumup-card"
      style={{ minHeight: 350, width: '100%' }}
    />
  )
}
