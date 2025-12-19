'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ProductForm } from '@/components/products/ProductForm'
import { productsAPI } from '@/lib/api'
import { Product } from '@/lib/types'

export default function EditProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      const response = await productsAPI.getById(id)
      if (response.success) {
        setProduct(response.data)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (data: any) => {
    if (params.id) {
      await productsAPI.update(params.id as string, data)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Product not found
        </h2>
        <p className="text-gray-600">
          The product you're looking for doesn't exist
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Edit Product
        </h1>
        <p className="text-gray-600">
          Update product information for "{product.name}"
        </p>
      </div>

      <ProductForm product={product} onSubmit={handleSubmit} isEdit />
    </div>
  )
}