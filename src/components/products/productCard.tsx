import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        {/* Product Image */}
        <div className="relative h-48 bg-gray-200">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category */}
          <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
              {product.description}
            </p>
          )}

          {/* Price and Stock */}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            
            {product.stock > 0 ? (
              <span className="text-xs text-green-600 font-semibold">
                In Stock ({product.stock})
              </span>
            ) : (
              <span className="text-xs text-red-600 font-semibold">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* View Details Button */}
        <div className="px-4 pb-4">
          <div className="w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition-colors">
            View Details
          </div>
        </div>
      </div>
    </Link>
  )
}