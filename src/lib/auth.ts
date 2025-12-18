
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ||"53730c384ae88fbfe1e58a92408c132fbc3b0950c19df178d0c9350a74b7028e"

// Hash a password
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

// Compare a password with its hashed version

export async function comparePassword(password:string, hash:string): Promise<boolean>{
    return bcrypt.compare(password, hash)
    
}

// Generate JWT token

export function generateToken(payload: JwtPayload): string {
    return Jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

// Verify JWT token

export function verifyToken(token: string): JwtPayload | null {
    try {
        return Jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
        return null;
    }
}

//Extract token from Authorization header

export function extractToken(authHeader: string | null): string | null {
    if ( !authHeader || !authHeader.startsWith('Bearer ')) {

        return null;
    }
    return authHeader.substring(7);
}