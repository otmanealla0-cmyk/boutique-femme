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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { customerName, customerEmail, customerPhone, address, city, postalCode, country, items } = body

  if (!customerName || !customerEmail || !items?.length) {
    return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
  }

  if (!EMAIL_REGEX.test(customerEmail)) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  }

  if (country === 'Suisse') {
    return NextResponse.json({ error: 'Nous ne livrons pas en Suisse.' }, { status: 400 })
  }

  // Validation des quantités
  for (const item of items) {
    const qty = Number(item.quantity)
    if (!Number.isInteger(qty) || qty < 1 || qty > 999) {
      return NextResponse.json({ error: 'Quantité invalide' }, { status: 400 })
    }
  }

  const orderNumber = `CMD-${Date.now().toString().slice(-8)}`
  const loggedInCustomer = await getCustomerFromCookies()

  try {
    const order = await prisma.$transaction(async (tx) => {
      const productIds = items.map((i: { productId: string }) => i.productId)
      const products = await tx.product.findMany({
        where: { id: { in: productIds }, active: true },
      })

      // Vérifier que tous les produits existent et sont actifs
      if (products.length !== [...new Set(productIds)].length) {
        throw new Error('PRODUCT_NOT_FOUND')
      }

      // Vérifier le stock et décrémenter de manière atomique
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId)!
        if (product.stock < item.quantity) {
          throw new Error(`STOCK_INSUFFICIENT:${product.name}`)
        }
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      const total = products.reduce((sum, product) => {
        const item = items.find((i: { productId: string }) => i.productId === product.id)
        return sum + product.price * (item?.quantity || 0)
      }, 0)

      return tx.order.create({
        data: {
          orderNumber,
          customerName,
          customerEmail,
          customerPhone: customerPhone || '',
          address: address || '',
          city: city || '',
          postalCode: postalCode || '',
          country: country || 'France',
          total,
          ...(loggedInCustomer ? { customerId: loggedInCustomer.id } : {}),
          items: {
            create: items.map((item: { productId: string; quantity: number; size?: string; color?: string; bagSize?: string; withBox?: boolean }) => {
              const p = products.find((p) => p.id === item.productId)!
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: p.price,
                size: item.size || '',
                color: item.color || '',
                bagSize: item.bagSize || '',
                withBox: item.withBox || false,
              }
            }),
          },
        },
        include: { items: { include: { product: true } } },
      })
    })

    return NextResponse.json(order, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'PRODUCT_NOT_FOUND') {
      return NextResponse.json({ error: 'Un produit est indisponible.' }, { status: 400 })
    }
    if (msg.startsWith('STOCK_INSUFFICIENT:')) {
      const name = msg.split(':')[1]
      return NextResponse.json({ error: `Stock insuffisant pour : ${name}` }, { status: 400 })
    }
    console.error('[orders POST]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
