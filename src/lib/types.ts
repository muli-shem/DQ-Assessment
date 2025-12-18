export interface User{
    id: string;
    email: string;
    name? : string | null;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

export  interface Product{
    id: string;
    name: string;
    description: string | null;
    price: number;
    category: string;
    imageUrl: string | null;
    stock : number,
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface JwtPayload{
    userId: string;
    email: string;
    role: string;
}

export interface RegisterRequest{
    email: string;
    password: string;
    name?: string;
}
export interface LoginRequest{
    email: string;
    password: string;
}
export interface AuthResponse{
    success: boolean;
    message: string;
    token?: string;
    user?: {
        id: string;
        email: string;
        name?: string | null;
        role: string;
    }
}
