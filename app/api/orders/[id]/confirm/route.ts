import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmation, sendAdminOrderAlert } from '@/lib/email'

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  })
  if (!order) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  if (order.status === 'pending') {
    await prisma.order.update({ where: { id }, data: { status: 'paid' } })

    await sendOrderConfirmation({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items,
      total: order.total,
      address: order.address,
      postalCode: order.postalCode,
      city: order.city,
    }).catch(err => console.error('[email client]', err))

    await sendAdminOrderAlert({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      total: order.total,
      items: order.items,
      city: order.city,
      country: order.country,
    }).catch(err => console.error('[email admin]', err))
  }

  return NextResponse.json({ ok: true })
}
