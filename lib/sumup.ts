const SUMUP_API = 'https://api.sumup.com/v0.1'

// Supporte 2 méthodes d'auth :
// 1. Clé API directe (SUMUP_API_KEY) — la plus simple
// 2. OAuth client_credentials (SUMUP_CLIENT_ID + SUMUP_CLIENT_SECRET)
async function getSumUpToken(): Promise<string> {
  if (process.env.SUMUP_API_KEY) {
    return process.env.SUMUP_API_KEY
  }

  const res = await fetch('https://api.sumup.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SUMUP_CLIENT_ID!,
      client_secret: process.env.SUMUP_CLIENT_SECRET!,
    }),
  })

  if (!res.ok) throw new Error('Impossible d\'obtenir le token SumUp')
  const data = await res.json()
  return data.access_token
}

export async function createSumUpCheckout(params: {
  amount: number
  currency: string
  orderId: string
  description: string
  returnUrl: string
}) {
  const token = await getSumUpToken()

  const res = await fetch(`${SUMUP_API}/checkouts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      checkout_reference: params.orderId,
      amount: params.amount,
      currency: params.currency,
      merchant_code: process.env.SUMUP_MERCHANT_CODE,
      description: params.description,
      return_url: params.returnUrl,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    console.error('SumUp error:', JSON.stringify(err))
    throw new Error(err.message || JSON.stringify(err))
  }

  return res.json()
}

export async function getSumUpCheckout(checkoutId: string) {
  const token = await getSumUpToken()

  const res = await fetch(`${SUMUP_API}/checkouts/${checkoutId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  return res.json()
}
