import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractToken } from '@/lib/auth';
import { ApiResponse } from '@/lib/api-response';

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a single product by its unique identifier (public endpoint)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product unique identifier
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // ← FIXED: Added await
        
        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (!product) {
            return ApiResponse.error('Product not found', 404);
        }

        return ApiResponse.success(product, 'Product fetched successfully');

    } catch (error: any) {
        return ApiResponse.serverError(error);
    }
}

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product
 *     description: Update an existing product's information (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product unique identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: MacBook Pro 16" (Updated)
 *               description:
 *                 type: string
 *                 example: Updated description
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 2599.99
 *               category:
 *                 type: string
 *                 example: Electronics
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *               stock:
 *                 type: integer
 *                 example: 15
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // ← FIXED: Added await
        
        const authHeader = request.headers.get('Authorization');
        const token = extractToken(authHeader);

        if (!token) {
            return ApiResponse.unauthorized('Authentication token missing');
        }

        const payload = await verifyToken(token);

        if (!payload || payload.role !== 'ADMIN') {
            return ApiResponse.forbidden('Admin access required');
        }

        const existingProduct = await prisma.product.findUnique({
            where: { id }
        });

        if (!existingProduct) {
            return ApiResponse.error('Product not found', 404);
        }

        const body = await request.json();
        const { name, description, price, category, imageUrl, stock, isActive } = body;

        if (price !== undefined) {
            const numericPrice = parseFloat(price);
            if (isNaN(numericPrice) || numericPrice <= 0) {
                return ApiResponse.error('Price must be a valid number greater than zero');
            }
        }

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
        });

        return ApiResponse.success(product, 'Product updated successfully');

    } catch (error: any) {
        return ApiResponse.serverError(error);
    }
}

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product
 *     description: Soft delete a product by setting isActive to false (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product unique identifier
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // ← FIXED: Added await
        
        const authHeader = request.headers.get('Authorization');
        const token = extractToken(authHeader);

        if (!token) {
            return ApiResponse.unauthorized('Authentication token missing');
        }

        const payload = await verifyToken(token);

        if (!payload || payload.role !== 'ADMIN') {
            return ApiResponse.forbidden('Admin access required');
        }

        const existingProduct = await prisma.product.findUnique({
            where: { id }
        });

        if (!existingProduct) {
            return ApiResponse.error('Product not found', 404);
        }

        const product = await prisma.product.update({
            where: { id },
            data: { isActive: false }
        });

        return ApiResponse.success(product, 'Product deleted successfully');

    } catch (error: any) {
        return ApiResponse.serverError(error);
    }
}