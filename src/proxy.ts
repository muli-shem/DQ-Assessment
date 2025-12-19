import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

// 1. Added 'async' to the middleware function
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (pathname === '/' || 
      pathname === '/login' || 
      pathname === '/register' || 
      pathname.startsWith('/products') ||
      pathname.startsWith('/_next') ||
      (pathname.startsWith('/api/products') && request.method === 'GET')) {
    return NextResponse.next()
  }

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value

    console.log('Middleware - Admin route check:', { pathname, hasToken: !!token })

    if (!token) {
      console.log('No token, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // 2. Added 'await' here
    const payload = await verifyToken(token)
    console.log('Token payload:', payload)

    if (!payload || payload.role !== 'ADMIN') {
      console.log('Invalid token or not admin, redirecting to home')
      return NextResponse.redirect(new URL('/', request.url))
    }

    console.log('Admin verified, allowing access')
  }

  // Protect POST, PUT, DELETE requests to /api/products
  if (pathname.startsWith('/api/products') && request.method !== 'GET') {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    // 3. Added 'await' here
    const payload = await verifyToken(token)

    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}