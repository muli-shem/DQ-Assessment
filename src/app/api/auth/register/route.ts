import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";
import { RegisterRequest, AuthResponse } from "@/lib/types";

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