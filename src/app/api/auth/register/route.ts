import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";
import { RegisterRequest, AuthResponse } from "@/lib/types";

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     description: Create a new user account with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             email: user@example.com
 *             password: securePassword123
 *             name: John Doe
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Lax; Max-Age=86400; Path=/
 *       400:
 *         description: Invalid input - Email and password required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User with this email already exists.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST(request: NextRequest) {
    try {
        const body: RegisterRequest = await request.json();
        const { email, password, name } = body;

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required.' },
                { status: 400 },
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'User with this email already exists.' },
                { status: 409 },
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null,
                role: 'USER', // default role
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        });

        // 1. Await the token generation (Critical: generateToken is now async)
        const token = await generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        const responseData: AuthResponse = {
            success: true,
            message: 'User registered successfully.',
            token,
            user,
        };

        // 2. Create the response object
        const response = NextResponse.json(responseData, { status: 201 });

        // 3. Set the cookie so the user is logged in immediately
        // This ensures Middleware recognizes the session right away
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('Error registering user:', error);
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error',
        }, { status: 500 });
    }
}