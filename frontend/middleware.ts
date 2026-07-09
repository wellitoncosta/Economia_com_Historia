import { NextResponse, type NextRequest } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const ADMIN_ROLES = new Set(['CRIADOR', 'REVISOR', 'MASTER'])

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const user = await response.json()
    if (!ADMIN_ROLES.has(user.role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/admin/utilizadores') && user.role !== 'MASTER') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
