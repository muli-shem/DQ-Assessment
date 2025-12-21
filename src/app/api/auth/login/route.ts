import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, generateToken } from "@/lib/auth";
import { LoginRequest, AuthResponse } from "@/lib/types";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password, returns JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: admin@example.com
 *             password: admin123
 *     responses:
 *       200:
 *         description: Login successful
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email and password are required.
 *       401:
 *         description: Invalid credentials
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
 *                   example: Invalid credentials
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST(request: NextRequest) {
    try {
        const body: LoginRequest = await request.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required.' },
                { status: 400 },
            );
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 },
            );
        }

        // Verify password
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 },
            );
        }

        // 1. Await the token generation (since jose is async)
        const token = await generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        const responseData: AuthResponse = {
            success: true,
            message: 'Login successful',
            token, 
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            }
        }

        // 2. Create the response object
        const response = NextResponse.json(responseData, { status: 200 });

        // 3. SET THE COOKIE so Middleware can see it
        response.cookies.set('auth-token', token, {
            httpOnly: true, // Prevents client-side JS from reading the token (XSS protection)
            secure: process.env.NODE_ENV === 'production', // Only sends over HTTPS in production
            sameSite: 'lax', 
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/', // Available across the whole site
        });

        return response;

    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}