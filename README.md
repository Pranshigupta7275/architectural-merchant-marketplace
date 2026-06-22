# Architectural Merchant Marketplace

A full-stack MERN e-commerce platform designed for luxury architectural assets, fine arts, premium brands, and industrial collections. The platform provides role-based access control, product management, order processing, analytics dashboards, and cloud-based media management.

## Overview

Architectural Merchant Marketplace is a multi-role marketplace that enables customers to discover and purchase curated products while allowing merchants and administrators to manage inventory, orders, customers, and business analytics through dedicated dashboards.

## Key Features

### Customer Features

* User Registration & Authentication
* Secure Login with JWT Authentication
* Browse Products
* Product Detail Pages
* Search & Filtering
* Shopping Cart Management
* Wishlist Management
* Checkout Flow
* Order History Tracking

### Merchant Features

* Merchant Dashboard
* Product Creation & Management
* Inventory Monitoring
* Order Management
* Customer Insights
* Product Image Uploads

### Admin Features

* Role-Based Access Control
* Platform Analytics Dashboard
* Customer Management
* Merchant Management
* Order Monitoring
* Product Oversight

### Security Features

* JWT Authentication
* Password Hashing with bcrypt
* Protected Routes
* Role-Based Authorization
* Rate Limiting
* MongoDB Sanitization
* XSS Protection
* HTTP Parameter Pollution Protection

## Technology Stack

### Frontend

* React 19
* Redux Toolkit
* RTK Query
* React Router
* Vite
* Tailwind CSS
* Framer Motion
* ApexCharts

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Cloudinary
* Multer

### DevOps & Deployment

* Git & GitHub
* Render
* MongoDB Atlas
* Cloudinary

## Project Structure

```text
architectural-merchant-marketplace/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   ├── scripts/
│   └── package.json
│
└── README.md
```

## Installation

### Clone Repository

```bash
git clone https://github.com/Pranshigupta7275/architectural-merchant-marketplace.git
cd architectural-merchant-marketplace
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET
```

## API Modules

### Authentication

* Register User
* Login User
* Refresh Token
* Logout User

### Products

* Get Products
* Get Product By ID
* Create Product
* Update Product
* Delete Product

### Orders

* Create Order
* View Orders
* View My Orders
* Update Order Status

### Analytics

* Revenue Analytics
* Order Analytics
* Product Analytics

### Customers

* Customer Management APIs

## Security Architecture

* JWT Access Tokens
* Password Encryption using bcrypt
* Route Protection Middleware
* Role-Based Access Control
* Express Rate Limiting
* MongoDB Injection Protection
* XSS Sanitization
* Secure Environment Variables

## Deployment

### Backend

* Render Web Service

### Frontend

* Render Static Site or Vercel

### Database

* MongoDB Atlas

### Media Storage

* Cloudinary

## Future Enhancements

* Payment Gateway Integration
* AI-Powered Product Recommendations
* Advanced Search
* Review & Rating System
* Real-Time Notifications
* Multi-Vendor Settlement System
* Order Tracking System

## Author

**Pranshi Gupta**

* Data Science & AI Engineer
* MERN Stack Developer
* Machine Learning Enthusiast

GitHub:
https://github.com/Pranshigupta7275

## License

This project is licensed under the MIT License.
