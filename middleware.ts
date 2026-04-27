import { NextRequest, NextResponse } from 'next/server'

const MAINTENANCE_PASSWORD = process.env.MAINTENANCE_PASSWORD || 'dressbyme2026'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Admin toujours accessible
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Accès avec le mot de passe via cookie
  const accessCookie = req.cookies.get('maintenance-access')?.value
  if (accessCookie === MAINTENANCE_PASSWORD) {
    return NextResponse.next()
  }

  // Page d'accès (pour entrer le mot de passe)
  if (pathname === '/maintenance-login') {
    return NextResponse.next()
  }

  // Bloquer tout le reste
  return NextResponse.redirect(new URL('/maintenance-login', req.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)'],
}
