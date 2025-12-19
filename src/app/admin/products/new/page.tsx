'use client'

import { ProductForm } from '@/components/products/ProductForm'
import { productsAPI } from '@/lib/api'

export default function NewProductPage() {
  const handleSubmit = async (data: any) => {
    await productsAPI.create(data)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Add New Product
        </h1>
        <p className="text-gray-600">
          Fill in the details to create a new product
        </p>
      </div>

      <ProductForm onSubmit={handleSubmit} />
    </div>
  )
}