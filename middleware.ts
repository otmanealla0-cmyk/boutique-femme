import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? 'fallback')

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/boutique/commande')) {
    const token = req.cookies.get('customer-token')?.value
    let valid = false
    if (token) {
      try {
        await jwtVerify(token, SECRET)
        valid = true
      } catch {}
    }
    if (!valid) {
      const url = req.nextUrl.clone()
      url.pathname = '/boutique/compte/connexion'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)'],
}
