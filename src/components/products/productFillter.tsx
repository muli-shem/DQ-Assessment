'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { debounce } from '@/lib/utils'

interface ProductFiltersProps {
  categories: string[]
  onSearch: (search: string) => void
  onCategoryFilter: (category: string) => void
  selectedCategory: string
}

export function ProductFilters({
  categories,
  onSearch,
  onCategoryFilter,
  selectedCategory
}: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('')

  // Debounce search to avoid too many requests
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      onSearch(searchTerm)
    }, 500)

    debouncedSearch()
  }, [searchTerm, onSearch])

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <Input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || selectedCategory) && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Active filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Search: "{searchTerm}"
              <button
                onClick={() => setSearchTerm('')}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              Category: {selectedCategory}
              <button
                onClick={() => onCategoryFilter('')}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}