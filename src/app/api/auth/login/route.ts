import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, generateToken } from "@/lib/auth";
import { LoginRequest, AuthResponse } from "@/lib/types";

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
        //Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        })
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 },
            );
        }
        //Verify password
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 },
            );
        }
        //Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })
        const response: AuthResponse = {
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
        return NextResponse.json(response, { status: 200 });

    } catch (error: any) {
        console.error('Login Error :', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error',
            },
            { status: 500, }
        );
    }

}