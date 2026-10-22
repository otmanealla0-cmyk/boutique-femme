const BASE_URL = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

async function getAccessToken(): Promise<string> {
  const res = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  })
  const data = await res.json()
  if (!data.access_token) {
    console.error('PayPal auth error:', JSON.stringify(data))
    throw new Error(`PayPal auth failed: ${data.error_description || data.error || JSON.stringify(data)}`)
  }
  return data.access_token
}

export async function createPayPalOrder(amount: number, orderId: string, returnUrl: string, cancelUrl: string) {
  const token = await getAccessToken()
  const res = await fetch(`${BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: orderId,
          amount: {
            currency_code: 'EUR',
            value: amount.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
        brand_name: 'Dress By Me',
        locale: 'fr-FR',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
      },
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'PayPal create order failed')
  }
  return res.json()
}

export async function capturePayPalOrder(paypalOrderId: string) {
  const token = await getAccessToken()
  const res = await fetch(`${BASE_URL}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'PayPal capture failed')
  }
  return res.json()
}
