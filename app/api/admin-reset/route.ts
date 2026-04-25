import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  const hashed = await bcrypt.hash('OtmLPB317', 12)

  await prisma.admin.deleteMany({})
  await prisma.admin.create({
    data: { email: 'admin@boutique.fr', password: hashed, name: 'Admin' },
  })

  return NextResponse.json({ ok: true })
}
