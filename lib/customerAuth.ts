import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const SECRET = process.env.NEXTAUTH_SECRET || 'customer-secret-key'
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

export function getCustomerFromCookies() {
  const token = cookies().get(COOKIE)?.value
  if (!token) return null
  return verifyCustomerToken(token)
}

export { COOKIE as CUSTOMER_COOKIE }
