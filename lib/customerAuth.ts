import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const SECRET = process.env.NEXTAUTH_SECRET!
if (!process.env.NEXTAUTH_SECRET) throw new Error('NEXTAUTH_SECRET doit être défini dans les variables d\'environnement')
const COOKIE = 'customer-token'

export function signCustomerToken(payload: { id: string; email: string; name: string }) {
  return jwt.sign(payload, SECRET, { expiresIn: '30d' })
}

export function verifyCustomerToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { id: string; email: string; name: string }
  } catch {
    return null
  }
}

export async function getCustomerFromCookies() {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) return null
  return verifyCustomerToken(token)
}

export { COOKIE as CUSTOMER_COOKIE }
