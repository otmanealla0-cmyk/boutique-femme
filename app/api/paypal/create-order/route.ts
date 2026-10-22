import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createPayPalOrder } from '@/lib/paypal'

export async function POST(req: NextRequest) {
  const { orderId } = await req.json()

  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })

  const baseUrl = process.env.NEXTAUTH_URL || 'https://dressbymee.shop'
  const returnUrl = `${baseUrl}/api/paypal/return?orderId=${orderId}`
  const cancelUrl = `${baseUrl}/boutique/paiement-annule`

  let paypalOrder
  try {
    paypalOrder = await createPayPalOrder(order.total, orderId, returnUrl, cancelUrl)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'PayPal API error'
    console.error('PayPal create order error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { sumupCheckoutId: paypalOrder.id },
  })

  const approvalUrl = paypalOrder.links?.find((l: { rel: string }) => l.rel === 'approve')?.href
  if (!approvalUrl) {
    return NextResponse.json({ error: 'URL approbation PayPal introuvable' }, { status: 500 })
  }

  return NextResponse.json({ approvalUrl })
}
