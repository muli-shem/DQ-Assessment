import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/products/productCard'
import { prisma } from '@/lib/prisma'

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 6 // Show 6 featured products
    })
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to Product Catalog
          </h1>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Discover our curated collection of quality products. Browse, search, and find exactly what you need.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button variant="secondary" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out our latest and most popular products
            </p>
          </div>

          {/* Products Grid */}
          {featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center">
                <Link href="/products">
                  <Button variant="primary" size="lg">
                    View All Products →
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products available at the moment. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Shop With Us</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-blue-600 text-5xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Extensive catalog with products across multiple categories to meet all your needs
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-blue-600 text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Easy to Browse</h3>
              <p className="text-gray-600">
                Advanced search and filtering features to help you find products quickly
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-blue-600 text-5xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                All products are carefully selected to ensure the highest quality standards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Electronics', 'Accessories', 'Clothing', 'Home & Garden'].map((category) => (
              <Link
                key={category}
                href={`/products?category=${category}`}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
            Browse our complete catalog and discover amazing products at great prices
          </p>
          <Link href="/products">
            <Button variant="secondary" size="lg">
              Explore All Products
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}