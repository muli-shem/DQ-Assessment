import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, extractToken } from '@/lib/auth'
import { ApiResponse } from '@/lib/api-response'

// GET /api/products/:id - Get single product (PUBLIC)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return ApiResponse.error('Product not found', 404);
    }

    return ApiResponse.success(product);

  } catch (error: any) {
    return ApiResponse.serverError(error);
  }
}

// PUT /api/products/:id - Update product (ADMIN ONLY)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify admin authentication
    const authHeader = request.headers.get('authorization')
    const token = extractToken(authHeader)

    if (!token) return ApiResponse.unauthorized();

    // CRITICAL: Await the async verifyToken
    const payload = await verifyToken(token)

    if (!payload || payload.role !== 'ADMIN') {
      return ApiResponse.forbidden('Admin access required');
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({ where: { id } })
    if (!existingProduct) {
      return ApiResponse.error('Product not found', 404);
    }

    // Parse request body
    const body = await request.json()
    const { name, description, price, category, imageUrl, stock, isActive } = body

    // Validate price if provided
    if (price !== undefined && parseFloat(price) <= 0) {
      return ApiResponse.error('Price must be greater than 0');
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(category && { category }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return ApiResponse.success(product, 'Product updated successfully');

  } catch (error: any) {
    return ApiResponse.serverError(error);
  }
}

// DELETE /api/products/:id - Delete product (ADMIN ONLY)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify admin authentication
    const authHeader = request.headers.get('authorization')
    const token = extractToken(authHeader)

    if (!token) return ApiResponse.unauthorized();

    // CRITICAL: Await the async verifyToken
    const payload = await verifyToken(token)

    if (!payload || payload.role !== 'ADMIN') {
      return ApiResponse.forbidden('Admin access required');
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({ where: { id } })
    if (!existingProduct) {
      return ApiResponse.error('Product not found', 404);
    }

    // Soft delete by setting isActive to false
    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false }
    })

    return ApiResponse.success(product, 'Product deleted successfully');

  } catch (error: any) {
    return ApiResponse.serverError(error);
  }
}