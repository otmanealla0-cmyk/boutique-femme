import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { capturePayPalOrder } from '@/lib/paypal'
import { sendOrderConfirmation, sendAdminOrderAlert } from '@/lib/email'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const orderId = searchParams.get('orderId')
  const token = searchParams.get('token') // PayPal order ID

  const baseUrl = process.env.NEXTAUTH_URL || 'https://dressbymee.shop'

  if (!orderId || !token) {
    return NextResponse.redirect(`${baseUrl}/boutique/paiement-annule`)
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  })

  if (!order) {
    return NextResponse.redirect(`${baseUrl}/boutique/paiement-annule`)
  }

  try {
    const capture = await capturePayPalOrder(token)
    if (capture.status !== 'COMPLETED') {
      return NextResponse.redirect(`${baseUrl}/boutique/paiement-annule`)
    }
  } catch (e) {
    console.error('PayPal capture error:', e)
    return NextResponse.redirect(`${baseUrl}/boutique/paiement-annule`)
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'paid' },
  })

  try {
    await sendOrderConfirmation({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items.map(i => ({
        product: { name: i.product.name },
        quantity: i.quantity,
        price: i.price,
        size: i.size,
        color: i.color,
      })),
      total: order.total,
      address: order.address,
      postalCode: order.postalCode,
      city: order.city,
    })
    await sendAdminOrderAlert({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      total: order.total,
      items: order.items.map(i => ({
        product: { name: i.product.name },
        quantity: i.quantity,
        price: i.price,
        size: i.size,
        color: i.color,
      })),
      city: order.city,
      country: order.country,
    })
  } catch (e) {
    console.error('Email send error:', e)
  }

  return NextResponse.redirect(`${baseUrl}/boutique/confirmation?order=${orderId}`)
}
