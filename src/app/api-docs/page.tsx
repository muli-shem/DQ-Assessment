'use client'

import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Product Catalog API Documentation</h1>
          <p className="text-blue-100">REST API endpoints for product management</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SwaggerUI url="/api/docs" />
      </div>
    </div>
  )
}
