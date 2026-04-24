import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { status } = await req.json()

  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status },
    include: { items: { include: { product: true } } },
  })

  return NextResponse.json(order)
}
