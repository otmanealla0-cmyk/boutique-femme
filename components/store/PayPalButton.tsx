'use client'

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'

interface Props {
  orderId: string
  onSuccess: () => void
  onError: (msg: string) => void
}

export default function PayPalButton({ orderId, onSuccess, onError }: Props) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!

  return (
    <PayPalScriptProvider options={{ clientId, currency: 'EUR' }}>
      <PayPalButtons
        style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
        createOrder={async () => {
          const res = await fetch('/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
          })
          const data = await res.json()
          if (!res.ok) {
            const msg = data.error || `Erreur serveur ${res.status}`
            onError(msg)
            throw new Error(msg)
          }
          return data.paypalOrderId
        }}
        onApprove={async (data) => {
          const res = await fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paypalOrderId: data.orderID, orderId }),
          })
          const result = await res.json()
          if (!res.ok) {
            onError(result.error || 'Paiement refusé')
            return
          }
          onSuccess()
        }}
        onError={(err) => {
          console.error('PayPal error:', err)
          onError('Une erreur est survenue, veuillez réessayer.')
        }}
        onCancel={() => onError('Paiement annulé.')}
      />
    </PayPalScriptProvider>
  )
}
