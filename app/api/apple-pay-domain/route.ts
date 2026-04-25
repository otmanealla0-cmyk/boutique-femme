import { NextResponse } from 'next/server'

export async function GET() {
  const content = process.env.APPLE_PAY_DOMAIN_ASSOCIATION

  if (!content) {
    return new NextResponse('Not configured', { status: 404 })
  }

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  })
}
