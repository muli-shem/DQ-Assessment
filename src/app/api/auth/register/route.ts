import { NextRequest,NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";
import { RegisterRequest, AuthResponse } from "@/lib/types";

export async function POST(request: NextRequest){
    try{
        const body: RegisterRequest = await request.json();
        const { email, password, name } = body;

        //validate input
        if (!email || !password){
            return NextResponse.json(
                { success: false, message: 'Email and password are required.' },
                { status: 400 },
            )

        }
        //check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })
        if (existingUser){
            return NextResponse.json(
                { success: false, message: 'User with this email already exists.' },
                { status: 409 },
            )
        }
        //hash password
        const hashedPassword = await hashPassword(password);

        //create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null,
                role: 'USER', //default role
            },
            select :{
                id: true,
                email: true,
                name: true,
                role: true
            }
        });

        //generate token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })
        const response: AuthResponse = {
            success: true,
            message: 'User registered successfully.',
            token,
            user,
        }
        return NextResponse.json(response, { status: 201 });

    } catch (error:any) {
        console.error('Error registering user:', error);
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error',},
    { status: 500,}
            
        )
    }
}