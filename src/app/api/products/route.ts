import {NextRequest, NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';
import { verifyToken, extractToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try{
        const {searchParams} = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        // Build query filters
        const where: any = { isActive: true };

        if(category){
            where.category = category;
        }
        if(search){
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
        return NextResponse.json({
             success: true,
             data: products,
             count: products.length,
    })
     }catch (error:any){
        console.error('Error fetching products:', error);
        return NextResponse.json(
            {sucess: false, message: 'Failed to fetch products'},
            {status: 500}
        )
    }
 } 
 //Post /api/products create a new product (admin only)

 export async function POST(request: NextRequest) {
    try{
        const authHeader = request.headers.get('Authorization');
        const token = extractToken(authHeader);

        if(!token){
            return NextResponse.json(
                {success:false, message: 'Authentication token missing'},
                {status: 401 }
            )
        }
        const payload = verifyToken(token)

        if(!payload || payload.role !== 'ADMIN'){
            return NextResponse.json(
                {success: false, message: 'Admin access required'},
                {status: 403}
            )
        }

        // Parse request body

        const body = await request.json()
            const {name, description, price, category, imageUrl, stock} = body;
        
            //validate input
            if(!name || !price || !category){
                return NextResponse.json(
                    {success: false, message: 'Name, price, and category are required'},
                    {status: 400}
                )
            }

            //Validate price 
            if(price <= 0){
                return NextResponse.json(
                    {success: false, message: 'Price must be greater than zero'},
                    {status: 400}
                )
            }
            //Create new product
            const product = await prisma.product.create({
                data: {
                    name,
                    description: description || null,
                    price: parseFloat(price),
                    category,
                    imageUrl: imageUrl || null,
                    stock: stock? parseInt(stock) : 0,

                }
            })
            return NextResponse.json({
                success: true,
                message: 'Product created successfully',
                data: product,
            }, {status: 201 });
    }catch (error:any){
        console.error('Error creating product:', error);
        return NextResponse.json(
            {success: false, message: 'Failed to create product'},
            {status: 500}
        )


    }
 }


