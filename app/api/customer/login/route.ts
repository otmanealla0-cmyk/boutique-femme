import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signCustomerToken, CUSTOMER_COOKIE } from '@/lib/customerAuth'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const customer = await prisma.customer.findUnique({ where: { email } })
  if (!customer)
    return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })

  const valid = await bcrypt.compare(password, customer.password)
  if (!valid)
    return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })

  await prisma.order.updateMany({
    where: { customerEmail: email, customerId: null },
    data: { customerId: customer.id },
  })

  const token = signCustomerToken({ id: customer.id, email: customer.email, name: customer.name })

  const res = NextResponse.json({ ok: true })
  res.cookies.set(CUSTOMER_COOKIE, token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 30, sameSite: 'lax' })
  return res
}
