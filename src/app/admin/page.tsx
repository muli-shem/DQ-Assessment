'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { productsAPI } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Cards'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    outOfStock: 0,
    categories: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await productsAPI.getAll()
      
      if (response.success) {
        const products = response.data
        const inStock = products.filter((p: any) => p.stock > 0).length
        const categories = new Set(products.map((p: any) => p.category)).size

        setStats({
          totalProducts: products.length,
          inStock,
          outOfStock: products.length - inStock,
          categories
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="relative inline-flex">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-2">
                Dashboard Overview
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Welcome back! Here's what's happening with your store.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-slate-700">Live</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10">
          {/* Total Products */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
            <Card className="relative bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
              <div className="relative flex items-center justify-between p-5 sm:p-6">
                <div className="flex-1">
                  <p className="text-blue-100 text-xs sm:text-sm font-semibold mb-1 uppercase tracking-wide">
                    Total Products
                  </p>
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1">{stats.totalProducts}</p>
                  <p className="text-blue-200 text-xs">All items in catalog</p>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>

          {/* In Stock */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
            <Card className="relative bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
              <div className="relative flex items-center justify-between p-5 sm:p-6">
                <div className="flex-1">
                  <p className="text-green-100 text-xs sm:text-sm font-semibold mb-1 uppercase tracking-wide">
                    In Stock
                  </p>
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1">{stats.inStock}</p>
                  <p className="text-green-200 text-xs">Available for sale</p>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>

          {/* Out of Stock */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
            <Card className="relative bg-gradient-to-br from-red-500 to-rose-600 text-white border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
              <div className="relative flex items-center justify-between p-5 sm:p-6">
                <div className="flex-1">
                  <p className="text-red-100 text-xs sm:text-sm font-semibold mb-1 uppercase tracking-wide">
                    Out of Stock
                  </p>
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1">{stats.outOfStock}</p>
                  <p className="text-red-200 text-xs">Needs restocking</p>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>

          {/* Categories */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
            <Card className="relative bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
              <div className="relative flex items-center justify-between p-5 sm:p-6">
                <div className="flex-1">
                  <p className="text-purple-100 text-xs sm:text-sm font-semibold mb-1 uppercase tracking-wide">
                    Categories
                  </p>
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1">{stats.categories}</p>
                  <p className="text-purple-200 text-xs">Product groups</p>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="mb-6 sm:mb-8 bg-white border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="p-5 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Quick Actions
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/admin/products/new" className="block">
                <Button variant="primary" className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 py-3 sm:py-4">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center gap-2 text-sm sm:text-base font-semibold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Product
                  </span>
                </Button>
              </Link>

              <Link href="/admin/products" className="block">
                <Button variant="outline" className="w-full group relative overflow-hidden border-2 border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 py-3 sm:py-4">
                  <span className="relative flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-slate-700 group-hover:text-slate-900">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    Manage Products
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="p-5 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Recent Activity
              </h2>
            </div>
            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="relative mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs font-bold text-yellow-900">!</span>
                </div>
              </div>
              <p className="text-slate-600 text-center text-sm sm:text-base font-medium mb-2">
                Activity logs coming soon...
              </p>
              <p className="text-slate-400 text-center text-xs sm:text-sm max-w-md">
                Track product updates, inventory changes, and more in real-time
              </p>
            </div>
          </div>
        </Card> 
      </div>
    </div>
  )
}