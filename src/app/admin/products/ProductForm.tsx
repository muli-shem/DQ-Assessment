'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Cards'
import { Product } from '@/lib/types'

interface ProductFormProps {
  product?: Product
  onSubmit: (data: any) => Promise<void>
  isEdit?: boolean
}

export function ProductForm({ product, onSubmit, isEdit = false }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    category: product?.category || '',
    imageUrl: product?.imageUrl || '',
    stock: product?.stock?.toString() || '0',
    isActive: product?.isActive ?? true
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0'
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required'
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be 0 or greater'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsLoading(true)

    try {
      await onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        category: formData.category.trim(),
        imageUrl: formData.imageUrl.trim() || null,
        stock: parseInt(formData.stock),
        isActive: formData.isActive
      })

      router.push('/admin/products')
    } catch (error: any) {
      alert(error.message || 'Failed to save product')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 mb-4"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Products</span>
          </button>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-2">
            {isEdit ? 'Update product information and inventory' : 'Fill in the details to create a new product'}
          </p>
        </div>

        <div onSubmit={handleSubmit}>
          <Card className="bg-white border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            {/* Form Header with Icon */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Product Information
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">
                    * Required fields
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
              {/* Product Name */}
              <div className="relative">
                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                <Input
                  label="Product Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="e.g., MacBook Pro 16-inch"
                  disabled={isLoading}
                  className="transition-all duration-200"
                />
              </div>

              {/* Description */}
              <div className="relative">
                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none hover:border-slate-300 disabled:bg-slate-50 disabled:cursor-not-allowed"
                      placeholder="Enter a detailed product description..."
                      disabled={isLoading}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-medium">
                      {formData.description.length} characters
                    </div>
                  </div>
                </div>
              </div>

              {/* Price and Stock */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="relative">
                  <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
                  <Input
                    label="Price (USD) *"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    error={errors.price}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    disabled={isLoading}
                  />
                </div>

                <div className="relative">
                  <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-amber-600 rounded-full"></div>
                  <Input
                    label="Stock Quantity *"
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    error={errors.stock}
                    placeholder="0"
                    min="0"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="relative">
                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-200 bg-white hover:border-slate-300 disabled:bg-slate-50 disabled:cursor-not-allowed font-medium ${
                        errors.category ? 'border-red-500' : 'border-slate-200'
                      }`}
                      disabled={isLoading}
                    >
                      <option value="">Select a category</option>
                      <option value="Electronics">📱 Electronics</option>
                      <option value="Accessories">💼 Accessories</option>
                      <option value="Clothing">👕 Clothing</option>
                      <option value="Home & Garden">🏡 Home & Garden</option>
                      <option value="Sports">⚽ Sports</option>
                      <option value="Books">📚 Books</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              {/* Image URL */}
              <div className="relative">
                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></div>
                <div>
                  <Input
                    label="Image URL"
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    disabled={isLoading}
                  />
                  {formData.imageUrl && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Preview:</p>
                      <div className="relative h-32 w-full rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                        <img 
                          src={formData.imageUrl} 
                          alt="Preview" 
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                              const errorMsg = document.createElement('div');
                              errorMsg.className = 'text-sm text-slate-500 text-center';
                              errorMsg.textContent = 'Invalid image URL';
                              parent.appendChild(errorMsg);
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Status */}
              <div className="relative">
                <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-6">
                      <input
                        type="checkbox"
                        name="isActive"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border-slate-300 rounded cursor-pointer transition-all duration-200"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="isActive" className="block text-sm font-bold text-slate-900 cursor-pointer">
                        Product is active
                      </label>
                      <p className="text-xs text-slate-600 mt-1">
                        {formData.isActive 
                          ? '✓ This product will be visible to customers on your store' 
                          : '⚠ This product will be hidden from customers'}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      formData.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="bg-slate-50 px-6 sm:px-8 py-6 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  onClick={handleSubmit}
                  className="flex-1 group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 py-4 text-base font-bold"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {isEdit ? 'Update Product' : 'Create Product'}
                      </>
                    )}
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                  className="flex-1 border-2 border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 transition-all duration-200 py-4 text-base font-bold text-slate-700 hover:text-slate-900"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </span>
                </Button>
              </div>
              
              {/* Helper text */}
              <p className="text-xs text-slate-500 text-center mt-4">
                All changes will be saved immediately after submission
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}