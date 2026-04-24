import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCustomerFromCookies } from '@/lib/customerAuth'

export async function GET() {
  const customer = getCustomerFromCookies()
  if (!customer) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })

  const orders = await prisma.order.findMany({
    where: { customerId: customer.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ customer, orders })
}
