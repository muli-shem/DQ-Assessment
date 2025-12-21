import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractToken } from '@/lib/auth';
import { ApiResponse } from '@/lib/api-response';

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve list of all active products with optional filtering (public endpoint)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category
 *         example: Electronics
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name or description
 *         example: laptop
 *     responses:
 *       200:
 *         description: Products retrieved successfully
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
 *                   example: Fetched 10 products
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        // Build query filters
        const where: any = { isActive: true };

        if (category) {
            where.category = category;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Fetch products from the database
        const products = await prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        return ApiResponse.success(
            products, 
            `Fetched ${products.length} products`
        );

    } catch (error: any) {
        return ApiResponse.serverError(error);
    }
}

/**
 * @swagger
 /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product in the catalog (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: MacBook Pro 16"
 *               description:
 *                 type: string
 *                 example: High-performance laptop for professionals
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 2499.99
 *               category:
 *                 type: string
 *                 example: Electronics
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/image.jpg
 *               stock:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Product created successfully
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
 *                   example: Product created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication token missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST(request: NextRequest) {
    try {
        // 1. Extract and Verify Token
        const authHeader = request.headers.get('Authorization');
        const token = extractToken(authHeader);

        if (!token) {
            return ApiResponse.unauthorized('Authentication token missing');
        }

        // IMPORTANT: We must 'await' because verifyToken now uses 'jose' (async)
        const payload = await verifyToken(token);

        if (!payload || payload.role !== 'ADMIN') {
            return ApiResponse.forbidden('Admin access required');
        }

        // 2. Parse and Validate Body
        const body = await request.json();
        const { name, description, price, category, imageUrl, stock } = body;

        if (!name || !price || !category) {
            return ApiResponse.error('Name, price, and category are required');
        }

        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice) || numericPrice <= 0) {
            return ApiResponse.error('Price must be a valid number greater than zero');
        }

        // 3. Create Product in DB
        const product = await prisma.product.create({
            data: {
                name,
                description: description || null,
                price: numericPrice,
                category,
                imageUrl: imageUrl || null,
                stock: stock ? parseInt(stock) : 0,
                isActive: true // Ensure new products are active by default
            }
        });

        return ApiResponse.success(product, 'Product created successfully', 201);

    } catch (error: any) {
        return ApiResponse.serverError(error);
    }
}