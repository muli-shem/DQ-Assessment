import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    // Check for token in Authorization header only
    const tokenFromHeader = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!tokenFromHeader) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    const payload = verifyToken(tokenFromHeader)
    
    if (!payload || payload.role !== 'ADMIN') {
      // Redirect to home if not admin
      return NextResponse.redirect(new URL('/', request.url))
    }
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
    
    const payload = verifyToken(token)
    
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      )
    }
  }
  
  return NextResponse.next()
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/products/:path*'
  ]
}