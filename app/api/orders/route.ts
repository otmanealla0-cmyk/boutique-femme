import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCustomerFromCookies } from '@/lib/customerAuth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const orders = await prisma.order.findMany({
    include: {
      items: { include: { product: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { customerName, customerEmail, customerPhone, address, city, postalCode, items } = body

  if (!customerName || !customerEmail || !items?.length) {
    return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
  }

  const productIds = items.map((i: { productId: string }) => i.productId)
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } })

  const total = items.reduce((sum: number, item: { productId: string; quantity: number }) => {
    const p = products.find(p => p.id === item.productId)
    return sum + (p?.price || 0) * item.quantity
  }, 0)

  const orderNumber = `CMD-${Date.now().toString().slice(-8)}`
  const loggedInCustomer = getCustomerFromCookies()

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      address: address || '',
      city: city || '',
      postalCode: postalCode || '',
      total,
      ...(loggedInCustomer ? { customerId: loggedInCustomer.id } : {}),
      items: {
        create: items.map((item: { productId: string; quantity: number; size?: string; color?: string }) => {
          const p = products.find(p => p.id === item.productId)
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: p?.price || 0,
            size: item.size || '',
            color: item.color || '',
          }
        }),
      },
    },
    include: { items: { include: { product: true } } },
  })

  return NextResponse.json(order, { status: 201 })
}
