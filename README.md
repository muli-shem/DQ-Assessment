Product Catalog Platform
A fullstack e-commerce product management system with role-based admin access and public browsing. Built with Next.js 15, TypeScript, and PostgreSQL.
 Live Demo
URL: https://dq-assessment.vercel.app/
Admin Access:
 Features
Admin Dashboard

Secure JWT authentication
Full CRUD operations for products
Real-time inventory management
Category and stock control

Public Interface

Browse product catalog
Search and filter products
Responsive product detail pages
Mobile-optimized design

Tech Stack

Frontend: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
Backend: Next.js API Routes (REST)
Database: PostgreSQL (Neon), Prisma ORM
Auth: JWT, bcryptjs
Deployment: Vercel


Products

GET /api/products - List products (public)
GET /api/products/:id - Product details (public)
POST /api/products - Create product (admin)
PUT /api/products/:id - Update product (admin)
DELETE /api/products/:id - Delete product (admin)

🚦 Quick Start
Prerequisites

Node.js 20.19+
pnpm (or npm)

Installation

Clone & Install

bashgit clone <your-repo-url>
cd product-catalog
pnpm install

Environment Setup

bashcp .env.example .env
Update .env:
envDATABASE_URL="your-neon-postgres-url"
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_API_URL="http://localhost:3000"

Database Setup

bashpnpm prisma migrate dev
pnpm prisma db seed

Run Development Server

bashpnpm dev
Visit http://localhost:3000
 Database Schema
User

id, email, password (hashed), name, role (USER/ADMIN)

Product

id, name, description, price, category, imageUrl, stock, isActive

Security

JWT token authentication
Password hashing (bcrypt)
Route protection via proxy middleware
Role-based access control
Input validation

Notes

Proxy Middleware: Uses proxy.ts instead of standard middleware for enhanced routing control
Database: Hosted on Neon (serverless PostgreSQL)
Images: Currently supports external URLs only

Deployment
Deployed on Vercel with automatic CI/CD from main branch.
Environment Variables:

DATABASE_URL - Neon PostgreSQL connection string
JWT_SECRET - Production secret key
NEXT_PUBLIC_API_URL - Production domain

Contributing

Fork the repository
Create feature branch (git checkout -b feature/AmazingFeature)
Commit changes (git commit -m 'Add AmazingFeature')
Push to branch (git push origin feature/AmazingFeature)
Open Pull Request


Built with Next.js, TypeScript, and Prisma