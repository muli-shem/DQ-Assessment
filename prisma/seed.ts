import {PrismaClient} from '@prisma/client'
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...');
    
    // Create an admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@gmail.com' },
        update:{},
        create: {
            email: 'admin@gmail.com',
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
      }
    ]
    });
    console.log('Sample products created');
    console.log('Seeding finished.')

}

main()
.catch((e)=>{
    console.error( 'Exrror during seeding')
    process.exit(1)

})
.finally(async()=>{
    await prisma.$disconnect()
})
