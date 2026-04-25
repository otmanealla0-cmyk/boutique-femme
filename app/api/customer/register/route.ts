import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signCustomerToken, CUSTOMER_COOKIE } from '@/lib/customerAuth'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password)
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 })

    const existing = await prisma.customer.findUnique({ where: { email } })
    if (existing)
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 409 })

    const hashed = await bcrypt.hash(password, 12)
    const customer = await prisma.customer.create({
      data: { name, email, password: hashed },
    })

    await prisma.order.updateMany({
      where: { customerEmail: email, customerId: null },
      data: { customerId: customer.id },
    })

    sendWelcomeEmail({ name, email }).catch(err => console.error('[welcome email]', err))

    const token = signCustomerToken({ id: customer.id, email: customer.email, name: customer.name })

    const res = NextResponse.json({ ok: true })
    res.cookies.set(CUSTOMER_COOKIE, token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 30, sameSite: 'lax' })
    return res
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[register]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
