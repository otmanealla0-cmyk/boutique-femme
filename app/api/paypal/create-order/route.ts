import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createPayPalOrder } from '@/lib/paypal'

export async function POST(req: NextRequest) {
  const { orderId } = await req.json()

  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })

  const paypalOrder = await createPayPalOrder(order.total, 'EUR')

  await prisma.order.update({
    where: { id: orderId },
    data: { sumupCheckoutId: paypalOrder.id },
  })

  return NextResponse.json({ paypalOrderId: paypalOrder.id })
}
