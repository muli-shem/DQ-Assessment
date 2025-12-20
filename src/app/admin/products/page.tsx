'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { productsAPI } from '@/lib/api'
import { formatPrice, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Product } from '@/lib/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await productsAPI.getAll()
      
      if (response.success) {
        setProducts(response.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await productsAPI.delete(id)
      setProducts(products.filter(p => p.id !== id))
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative inline-flex">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-2">
              Product Management
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Manage your product catalog • {products.length} {products.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <Link href="/admin/products/new" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 px-6 py-3">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
              <span className="relative flex items-center justify-center gap-2 font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Product
              </span>
            </Button>
          </Link>
        </div>

        {/* Products Table */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12 lg:p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="relative inline-block mb-6">
                <div className="text-7xl sm:text-8xl mb-4 animate-bounce">📦</div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                No products yet
              </h3>
              <p className="text-slate-600 mb-8 text-sm sm:text-base leading-relaxed">
                Get started by adding your first product to your catalog. You can add images, set prices, and manage inventory.
              </p>
              <Link href="/admin/products/new">
                <Button variant="primary" className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 px-8 py-4 text-base sm:text-lg font-semibold">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  <span className="relative">Add Your First Product</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Mobile Card View */}
            <div className="block lg:hidden">
              <div className="divide-y divide-slate-200">
                {products.map((product) => (
                  <div key={product.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors duration-200">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="h-20 w-20 sm:h-24 sm:w-24 relative rounded-xl overflow-hidden shadow-md ring-2 ring-slate-100">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 80px, 96px"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300">
                            {product.category}
                          </span>
                          {product.isActive ? (
                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border border-green-300">
                              ● Active
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-red-100 to-rose-200 text-red-800 border border-red-300">
                              ● Inactive
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mb-3 text-sm">
                          <div className="font-bold text-slate-900 text-base sm:text-lg">
                            {formatPrice(product.price)}
                          </div>
                          <div className="text-slate-600">
                            Stock: <span className="font-semibold text-slate-900">{product.stock}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Link href={`/admin/products/${product.id}/edit`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200">
                              Edit
                            </Button>
                          </Link>
                          {deleteConfirm === product.id ? (
                            <>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(product.id)}
                                className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md"
                              >
                                Confirm
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 border-2"
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setDeleteConfirm(product.id)}
                              className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md"
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors duration-150 group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0 relative rounded-lg overflow-hidden shadow-md ring-2 ring-slate-100 group-hover:ring-blue-200 transition-all duration-200">
                            {product.imageUrl ? (
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                              {product.name}
                            </div>
                            <div className="text-sm text-slate-600 max-w-xs truncate">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-slate-900">
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.isActive ? (
                          <span className="px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border border-green-300">
                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5 mt-0.5 animate-pulse"></span>
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full bg-gradient-to-r from-red-100 to-rose-200 text-red-800 border border-red-300">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-1.5 mt-0.5"></span>
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Button variant="outline" size="sm" className="border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-semibold">
                              Edit
                            </Button>
                          </Link>
                          {deleteConfirm === product.id ? (
                            <div className="flex gap-2">
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(product.id)}
                                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md font-semibold"
                              >
                                Confirm
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteConfirm(null)}
                                className="border-2 border-slate-300 hover:border-slate-400 font-semibold"
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setDeleteConfirm(product.id)}
                              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md font-semibold"
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}