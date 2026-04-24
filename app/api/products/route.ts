import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const admin = searchParams.get('admin')

  const where: Record<string, unknown> = {}
  if (!admin) where.active = true
  if (category) where.categoryId = category

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await req.json()
  const { name, description, price, stock, images, sizes, colors, featured, categoryId } = body

  if (!name || !price || !categoryId) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  const product = await prisma.product.create({
    data: {
      name,
      description: description || '',
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      images: JSON.stringify(images || []),
      sizes: JSON.stringify(sizes || []),
      colors: JSON.stringify(colors || []),
      featured: featured || false,
      categoryId,
    },
    include: { category: true },
  })

  return NextResponse.json(product, { status: 201 })
}
