import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSumUpCheckout } from '@/lib/sumup'

export async function POST(req: NextRequest) {
  const { orderId } = await req.json()

  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })

  const hasApiKey = !!process.env.SUMUP_API_KEY
  const hasOAuth = !!(process.env.SUMUP_CLIENT_ID && process.env.SUMUP_CLIENT_SECRET)

  if (!hasApiKey && !hasOAuth) {
    return NextResponse.json(
      { error: 'Clés SumUp manquantes dans .env.local' },
      { status: 503 }
    )
  }

  const checkout = await createSumUpCheckout({
    amount: order.total,
    currency: 'EUR',
    orderId: order.orderNumber,
    description: `Commande ${order.orderNumber} – Dress By Me`,
    returnUrl: `${process.env.NEXTAUTH_URL || 'https://dressbymee.shop'}/boutique/confirmation?order=${order.id}`,
  })

  await prisma.order.update({
    where: { id: orderId },
    data: { sumupCheckoutId: checkout.id },
  })

  // On retourne le checkoutId pour le widget embarqué
  return NextResponse.json({ checkoutId: checkout.id })
}
