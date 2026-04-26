import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  })
  if (!product) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { name, description, price, stock, images, sizes, colors, bagSizes, hasBoxOption, colorImages, featured, active, categoryId } = body

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      images: JSON.stringify(images || []),
      sizes: JSON.stringify(sizes || []),
      colors: JSON.stringify(colors || []),
      bagSizes: JSON.stringify(bagSizes || []),
      hasBoxOption: hasBoxOption || false,
      colorImages: JSON.stringify(colorImages || {}),
      featured,
      active,
      categoryId,
    },
    include: { category: true },
  })

  return NextResponse.json(product)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params

  await prisma.product.update({
    where: { id },
    data: { active: false },
  })

  return NextResponse.json({ ok: true })
}
