import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractToken } from '@/lib/auth';
import { ApiResponse } from '@/lib/api-response'; // Ensure you created

// GET: Fetch all products with optional filters
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

// POST: Create a new product (Admin Only)
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