'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { isAuthenticated, isAdmin, authAPI } from '@/lib/api'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [authenticated, setAuthenticated] = useState(false)
  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    setAuthenticated(isAuthenticated())
    setAdmin(isAdmin())
  }, [pathname])

  const handleLogout = () => {
    authAPI.logout()
    setAuthenticated(false)
    setAdmin(false)
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              DQ Products
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              href="/products"
              className={`text-gray-700 hover:text-blue-600 transition-colors ${
                pathname === '/products' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Products
            </Link>

            {/* Show different options based on auth state */}
            {authenticated && admin ? (
              <>
                <Link
                  href="/admin"
                  className={`text-gray-700 hover:text-blue-600 transition-colors ${
                    pathname?.startsWith('/admin') ? 'text-blue-600 font-semibold' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="primary" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
