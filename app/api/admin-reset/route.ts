import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  const hashed = await bcrypt.hash('DressbyMe2024!', 12)

  await prisma.admin.upsert({
    where: { email: 'admin@boutique.fr' },
    update: { password: hashed },
    create: { email: 'admin@boutique.fr', password: hashed, name: 'Admin' },
  })

  return NextResponse.json({ ok: true, email: 'admin@boutique.fr', password: 'DressbyMe2024!' })
}
