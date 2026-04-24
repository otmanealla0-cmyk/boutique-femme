import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  if (order.status === 'pending') {
    await prisma.order.update({ where: { id }, data: { status: 'paid' } })
  }

  return NextResponse.json({ ok: true })
}
