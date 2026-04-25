import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email'

export async function GET() {
  await sendWelcomeEmail({ name: 'Otmane', email: 'otmanealla0@gmail.com' })
  return NextResponse.json({ ok: true })
}
