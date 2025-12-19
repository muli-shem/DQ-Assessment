'use client'

import { useState, useEffect } from 'react'
import { ProductList } from '@/components/products/productList'
import { ProductFilters } from '@/components/products/productFillter'
import { productsAPI } from '@/lib/api'
import { getUniqueCategories } from '@/lib/utils'
import { Product } from '@/lib/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Fetch products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  // Filter products when search or category changes
  useEffect(() => {
    filterProducts()
  }, [products, searchQuery, selectedCategory])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await productsAPI.getAll()
      
      if (response.success) {
        setProducts(response.data)
        setFilteredProducts(response.data)
        setCategories(getUniqueCategories(response.data))
      } else {
        setError('Failed to load products')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      )
    }

    setFilteredProducts(filtered)
  }

  const handleSearch = (search: string) => {
    setSearchQuery(search)
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Our Products
          </h1>
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Filters */}
        <ProductFilters
          categories={categories}
          onSearch={handleSearch}
          onCategoryFilter={handleCategoryFilter}
          selectedCategory={selectedCategory}
        />

        {/* Product List */}
        <ProductList products={filteredProducts} />
      </div>
    </div>
  )
}