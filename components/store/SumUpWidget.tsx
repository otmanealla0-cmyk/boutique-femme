'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

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

  function handleScriptLoad() {
    if (mounted.current) return
    mounted.current = true

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

  useEffect(() => {
    if (window.SumUpCard && !mounted.current) {
      handleScriptLoad()
    }
  }, [])

  return (
    <>
      <Script
        src="https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      <div id="sumup-card" className="min-h-[300px]" />
    </>
  )
}
