import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const orderNumber = searchParams.get('orderNumber')?.trim().toUpperCase()

  if (!orderNumber) {
    return NextResponse.json({ error: 'Numéro de commande requis' }, { status: 400 })
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      orderNumber: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      customerName: true,
      city: true,
      country: true,
    },
  })

  if (!order) {
    return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })
  }

  return NextResponse.json(order)
}
