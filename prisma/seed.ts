import {PrismaClient} from '@prisma/client'
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...');
    
    // Create an admin user
    const hashedPassword = await bcrypt.hash('admin1234', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'mulimutua904@gmail.com' },
        update:{},
        create: {
            email: 'mulimutua904@gmail.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
        }      
    })
    console.log('Admin user created:', admin.email);
    

    await prisma.product.createMany({
        data: [
            {
                name: 'MacBook Pro 16"',
                description: 'Powerful laptop for professionals with M3 Pro chip, 16GB RAM, 512GB SSD',
                price: 2499.99,
                category: 'Electronics',
                stock: 10,
                imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'
            },
            {
                name: 'Wireless Mouse',
                description: 'Ergonomic wireless mouse with precision tracking',
                price: 29.99,
                category: 'Accessories',
                stock: 50,
                imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400'
            },
            {
                name: 'USB-C Hub',
                description: '7-in-1 USB-C hub with HDMI, SD card reader, and USB 3.0 ports',
                price: 49.99,
                category: 'Accessories',
                stock: 30,
                imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400'
            },
            {
                name: 'iPhone 15 Pro',
                description: 'Latest iPhone with A17 Pro chip, titanium design, 256GB storage',
                price: 1199.99,
                category: 'Electronics',
                stock: 25,
                imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
            },
            {
                name: 'Sony WH-1000XM5',
                description: 'Industry-leading noise canceling wireless headphones',
                price: 399.99,
                category: 'Electronics',
                stock: 15,
                imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400'
            },
            {
                name: 'Mechanical Keyboard',
                description: 'RGB backlit mechanical gaming keyboard with Cherry MX switches',
                price: 149.99,
                category: 'Accessories',
                stock: 40,
                imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400'
            },
            {
                name: 'iPad Air',
                description: '10.9-inch Liquid Retina display, M2 chip, 128GB',
                price: 599.99,
                category: 'Electronics',
                stock: 20,
                imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'
            },
            {
                name: '4K Webcam',
                description: 'Professional 4K webcam with auto-focus and noise reduction',
                price: 179.99,
                category: 'Accessories',
                stock: 35,
                imageUrl: 'https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=400'
            },
            {
                name: 'Portable SSD 1TB',
                description: 'Ultra-fast portable SSD with USB 3.2 Gen 2, 1050MB/s read speed',
                price: 129.99,
                category: 'Accessories',
                stock: 45,
                imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400'
            },
            {
                name: 'Samsung Galaxy S24',
                description: 'Flagship Android phone with AI features, 256GB storage',
                price: 899.99,
                category: 'Electronics',
                stock: 18,
                imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'
            },
            {
                name: 'Monitor 27" 4K',
                description: '27-inch 4K IPS monitor with HDR support and USB-C connectivity',
                price: 449.99,
                category: 'Electronics',
                stock: 12,
                imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400'
            },
            {
                name: 'Laptop Stand',
                description: 'Aluminum laptop stand with adjustable height and angle',
                price: 39.99,
                category: 'Accessories',
                stock: 60,
                imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'
            },
            {
                name: 'Wireless Charger',
                description: '15W fast wireless charging pad compatible with iPhone and Android',
                price: 34.99,
                category: 'Accessories',
                stock: 55,
                imageUrl: 'https://images.unsplash.com/photo-1589492477829-e7c89a7b3d7d?w=400'
            },
            {
                name: 'AirPods Pro 2',
                description: 'Wireless earbuds with active noise cancellation and spatial audio',
                price: 249.99,
                category: 'Electronics',
                stock: 22,
                imageUrl: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400'
            },
            {
                name: 'Smart Watch',
                description: 'Fitness tracking smartwatch with heart rate monitor and GPS',
                price: 279.99,
                category: 'Electronics',
                stock: 28,
                imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
            },
            {
                name: 'HDMI Cable 4K',
                description: '6ft 4K HDMI 2.1 cable supporting 8K@60Hz and 4K@120Hz',
                price: 19.99,
                category: 'Accessories',
                stock: 100,
                imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
            },
            {
                name: 'Bluetooth Speaker',
                description: 'Portable waterproof Bluetooth speaker with 20-hour battery life',
                price: 89.99,
                category: 'Electronics',
                stock: 32,
                imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400'
            },
            {
                name: 'Desk Mat',
                description: 'Large extended gaming desk mat with stitched edges, 31.5" x 15.7"',
                price: 24.99,
                category: 'Accessories',
                stock: 70,
                imageUrl: 'https://images.unsplash.com/photo-1625225233840-695456021cde?w=400'
            },
            {
                name: 'USB Flash Drive 128GB',
                description: 'High-speed USB 3.1 flash drive with metal casing',
                price: 22.99,
                category: 'Accessories',
                stock: 80,
                imageUrl: 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=400'
            },
            {
                name: 'Laptop Backpack',
                description: 'Water-resistant laptop backpack with USB charging port, fits 15.6" laptops',
                price: 54.99,
                category: 'Accessories',
                stock: 42,
                imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
            }
        ]
    });
    console.log('Sample products created');
    console.log('Seeding finished.')

}

main()
.catch((e)=>{
    console.error('Error during seeding:', e)
    process.exit(1)

})
.finally(async()=>{
    await prisma.$disconnect()
})