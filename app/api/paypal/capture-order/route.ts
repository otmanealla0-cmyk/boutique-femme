import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { capturePayPalOrder } from '@/lib/paypal'

export async function POST(req: NextRequest) {
  const { paypalOrderId, orderId } = await req.json()

  const capture = await capturePayPalOrder(paypalOrderId)

  if (capture.status !== 'COMPLETED') {
    return NextResponse.json({ error: 'Paiement non complété' }, { status: 400 })
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'paid' },
  })

  return NextResponse.json({ success: true })
}
