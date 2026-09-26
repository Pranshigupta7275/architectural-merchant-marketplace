# API Documentation
## Architectural Merchant Marketplace

**Base URL**: `http://localhost:5000/api/v1`  
**Environment**: Development  
**Authentication**: JWT Bearer Token  
**Content-Type**: `application/json` (except for multipart/form-data on upload routes)

---

## Table of Contents
1. [Authentication](#authentication)
2. [Users](#users)
3. [Products](#products)
4. [Orders](#orders)
5. [Customers](#customers)
6. [Payments](#payments)
7. [Analytics](#analytics)
8. [Upload](#upload)
9. [Error Handling](#error-handling)
10. [Postman Collection](#postman-collection)

---

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Register User
```http
POST /auth/register
```

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer" // optional, defaults to "customer"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login User
```http
POST /auth/login
```

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response** (401):
```json
{
  "success": false,
  "status": 401,
  "message": "Invalid credentials."
}
```

---

### Refresh Token
```http
POST /auth/refresh
```

**Request Body**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200):
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Logout User
```http
POST /auth/logout
```

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Users

### Get My Profile
```http
GET /users/profile
```

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### Update My Profile
```http
PUT /users/profile
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "newpassword123" // optional
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "customer"
  }
}
```

---

### Get All Users (Admin Only)
```http
GET /users
```

**Headers**: `Authorization: Bearer <token>`  
**Access**: Admin only

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

## Products

### Get All Products
```http
GET /products
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `keyword` | string | Search by title or SKU (case-insensitive) |
| `category` | string | Filter by category (Assets, Fine Art, Industrial, Brands, Collection) |
| `status` | string | Filter by status (DRAFT, ACTIVE, ARCHIVED) |
| `minPrice` | number | Minimum price filter |
| `maxPrice` | number | Maximum price filter |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

**Example**: `GET /products?keyword=sofa&category=Assets&minPrice=100&maxPrice=5000&page=1&limit=10`

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "merchantId": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
        "name": "Premium Furniture Co",
        "email": "merchant@furniture.com"
      },
      "title": "Mid-Century Modern Leather Sofa",
      "price": 899.99,
      "category": "Assets",
      "status": "ACTIVE",
      "images": [
        { "url": "https://images.unsplash.com/photo-...", "isMain": true }
      ],
      "averageRating": 4.5,
      "numOfReviews": 12,
      "technicalSpecs": {
        "primaryMaterial": "Leather",
        "finish": "Matte",
        "dimensions": { "width": 200, "height": 85, "depth": 90 },
        "weightCapacity": 150,
        "availablePalettes": ["Black", "Tan"]
      },
      "inventory": {
        "sku": "SOFA-MOD-01",
        "stockQuantity": 15,
        "lowStockAlert": 5,
        "displayStockCount": false
      },
      "shipping": {
        "itemWeight": 45,
        "packageDimensions": { "length": 210, "width": 100, "height": 95 },
        "shippingClass": "Heavy/Bulky"
      },
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pages": 5,
    "totalProducts": 48
  }
}
```

---

### Get Product by ID
```http
GET /products/:id
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "merchantId": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Premium Furniture Co",
      "email": "merchant@furniture.com"
    },
    "title": "Mid-Century Modern Leather Sofa",
    "price": 899.99,
    "category": "Assets",
    "status": "ACTIVE",
    "images": [...],
    "averageRating": 4.5,
    "numOfReviews": 12,
    "technicalSpecs": {...},
    "inventory": {...},
    "shipping": {...},
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### Create Product (Merchant/Admin Only)
```http
POST /products
```

**Headers**: `Authorization: Bearer <token>`  
**Content-Type**: `multipart/form-data`

**Form Data Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Product title |
| `price` | number | Yes | Product price |
| `category` | string | Yes | Category enum |
| `status` | string | No | DRAFT, ACTIVE, or ARCHIVED (default: DRAFT) |
| `technicalSpecs` | JSON string | No | `{"primaryMaterial":"Leather","finish":"Matte"}` |
| `inventory` | JSON string | No | `{"sku":"SOFA-01","stockQuantity":15}` |
| `shipping` | JSON string | No | `{"shippingClass":"Heavy/Bulky"}` |
| `images` | File[] | No | Up to 5 images (max 5MB each) |

**Request Body (FormData)**:
```
title: Mid-Century Modern Leather Sofa
price: 899.99
category: Assets
status: ACTIVE
technicalSpecs: {"primaryMaterial":"Leather","finish":"Matte"}
inventory: {"sku":"SOFA-MOD-01","stockQuantity":15}
shipping: {"shippingClass":"Heavy/Bulky"}
images: [file1.jpg, file2.jpg]
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "merchantId": "64f1a2b3c4d5e6f7g8h9i0j2",
    "title": "Mid-Century Modern Leather Sofa",
    "price": 899.99,
    "category": "Assets",
    "status": "ACTIVE",
    "images": [
      { "url": "https://res.cloudinary.com/...", "isMain": true }
    ],
    "averageRating": 0,
    "numOfReviews": 0,
    "technicalSpecs": {...},
    "inventory": {...},
    "shipping": {...},
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Error Response** (400 - Duplicate SKU):
```json
{
  "success": false,
  "status": 400,
  "message": "A product with this SKU already exists. Please use a unique SKU."
}
```

---

### Update Product
```http
PUT /products/:id
```

**Headers**: `Authorization: Bearer <token>`  
**Content-Type**: `multipart/form-data`

Same fields as Create Product. Merchants can only update their own products. Admins can update any product.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "title": "Updated Product Title",
    "price": 999.99,
    ...
  }
}
```

**Error Response** (403):
```json
{
  "success": false,
  "status": 403,
  "message": "Not authorized to access this resource"
}
```

---

### Delete Product
```http
DELETE /products/:id
```

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "message": "Product removed successfully"
}
```

---

## Orders

### Create Order
```http
POST /orders
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "orderItems": [
    {
      "name": "Mid-Century Modern Leather Sofa",
      "quantity": 1,
      "image": "https://images.unsplash.com/photo-...",
      "price": 899.99,
      "product": "64f1a2b3c4d5e6f7g8h9i0j1"
    }
  ],
  "shippingAddress": {
    "address": "123 Luxury Lane",
    "city": "Design District",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "Stripe",
  "merchantId": "64f1a2b3c4d5e6f7g8h9i0j2"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
    "user": "64f1a2b3c4d5e6f7g8h9i0j1",
    "merchantId": "64f1a2b3c4d5e6f7g8h9i0j2",
    "orderItems": [
      {
        "name": "Mid-Century Modern Leather Sofa",
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-...",
        "price": 899.99,
        "product": "64f1a2b3c4d5e6f7g8h9i0j1"
      }
    ],
    "shippingAddress": {
      "address": "123 Luxury Lane",
      "city": "Design District",
      "postalCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "Stripe",
    "totalPrice": 899.99,
    "status": "Pending",
    "isPaid": false,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Error Response** (400 - Insufficient Stock):
```json
{
  "success": false,
  "status": 400,
  "message": "Insufficient stock for Mid-Century Modern Leather Sofa. Only 2 left."
}
```

---

### Get My Orders
```http
GET /orders/myorders
```

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
      "user": "64f1a2b3c4d5e6f7g8h9i0j1",
      "merchantId": "64f1a2b3c4d5e6f7g8h9i0j2",
      "orderItems": [...],
      "shippingAddress": {...},
      "paymentMethod": "Stripe",
      "totalPrice": 899.99,
      "status": "Delivered",
      "isPaid": true,
      "paidAt": "2024-01-16T10:00:00.000Z",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### Get Order by ID
```http
GET /orders/:id
```

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
    "user": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "merchantId": "64f1a2b3c4d5e6f7g8h9i0j2",
    "orderItems": [...],
    "shippingAddress": {...},
    "paymentMethod": "Stripe",
    "totalPrice": 899.99,
    "status": "Delivered",
    "isPaid": true,
    "paidAt": "2024-01-16T10:00:00.000Z",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Error Response** (403):
```json
{
  "success": false,
  "status": 403,
  "message": "Not authorized to view this order"
}
```

---

### Get All Orders (Merchant/Admin)
```http
GET /orders
```

**Headers**: `Authorization: Bearer <token>`  
**Access**: Merchant (sees own orders) or Admin (sees all)

**Response** (200):
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
      "user": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "name": "John Doe"
      },
      "orderItems": [...],
      "totalPrice": 899.99,
      "status": "Pending",
      "isPaid": false,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### Update Order to Paid
```http
PUT /orders/:id/pay
```

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
    "isPaid": true,
    "paidAt": "2024-01-15T12:00:00.000Z",
    "status": "Processing"
  }
}
```

---

## Customers

### Get All Customers (Merchant/Admin)
```http
GET /customers
```

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
      "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Julian Thorne",
      "email": "j.thorne@architectural.design",
      "avatar": "https://images.unsplash.com/photo-...",
      "segment": "VIP",
      "orders": 42,
      "ltv": 84200.00,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

**Note**: Customers are sorted by LTV (Lifetime Value) in descending order.

---

### Seed Customers (Admin Only)
```http
POST /customers/seed
```

**Headers**: `Authorization: Bearer <token>`  
**Access**: Admin only

**Response** (201):
```json
{
  "success": true,
  "message": "Database successfully seeded!",
  "count": 6,
  "data": [...]
}
```

---

## Payments

### Create Stripe Payment Intent
```http
POST /payments/stripe/create-intent
```

**Headers**: `Authorization: Bearer <token>` (optional)

**Request Body**:
```json
{
  "totalAmount": 899.99
}
```

**Response** (200):
```json
{
  "clientSecret": "pi_3Mz..._secret_..."
}
```

---

### Create Razorpay Order
```http
POST /payments/razorpay/create-order
```

**Headers**: `Authorization: Bearer <token>` (optional)

**Request Body**:
```json
{
  "totalAmount": 899.99
}
```

**Response** (200):
```json
{
  "id": "order_Mnw2...",
  "entity": "order",
  "amount": 739919,
  "currency": "INR",
  "status": "created",
  "formattedINR": 8899.99
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Invalid total amount provided."
}
```

---

### Verify Razorpay Payment
```http
POST /payments/razorpay/verify-payment
```

**Headers**: `Authorization: Bearer <token>` (optional)

**Request Body**:
```json
{
  "razorpay_order_id": "order_Mnw2...",
  "razorpay_payment_id": "pay_Mnw2...",
  "razorpay_signature": "generated_hmac_signature"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

---

## Analytics

### Get Analytics Stats (Merchant/Admin)
```http
GET /analytics/stats
```

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "totalRevenue": 142850.00,
    "activeListings": 48,
    "conversionRate": 3.82,
    "revenueData": [
      { "date": "2024-01-01", "revenue": 1200 },
      { "date": "2024-01-02", "revenue": 1800 },
      { "date": "2024-01-03", "revenue": 1500 }
    ]
  }
}
```

**Note**: `totalRevenue` only includes orders with `status: "Delivered"`. Admins see platform-wide data; merchants see only their own.

---

### Get Recent Transactions
```http
GET /analytics/recent-transactions
```

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
      "user": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "orderItems": [
        {
          "product": {
            "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
            "title": "Mid-Century Modern Leather Sofa",
            "images": [{ "url": "https://..." }],
            "price": 899.99
          }
        }
      ],
      "totalPrice": 899.99,
      "status": "Delivered",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

## Upload

### Upload Single Image
```http
POST /upload
```

**Headers**: `Authorization: Bearer <token>`  
**Content-Type**: `multipart/form-data`

**Form Data**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | File | Yes | Image file (JPG, JPEG, PNG, WEBP, max 5MB) |

**Response** (200):
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "/uploads/image-1684321098.jpg"
  }
}
```

---

## Error Handling

All errors follow this standard format:

```json
{
  "success": false,
  "status": 400,
  "message": "Error description here"
}
```

### Common HTTP Status Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error, duplicate key) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limit exceeded) |
| 500 | Internal Server Error |

### Error Types Handled

| Error | Status | Message |
|-------|--------|---------|
| `CastError` | 400 | `Invalid <field>: <value>.` |
| Duplicate Key (11000) | 400 | `Duplicate field value: <value>. Please use another value.` |
| `ValidationError` | 400 | `Invalid input data. <errors>` |
| `JsonWebTokenError` | 401 | `Invalid token. Please log in again.` |
| `TokenExpiredError` | 401 | `Your token has expired. Please log in again.` |
| `MulterError` | 400 | `File is too large. Please upload an image smaller than 5MB.` |

---

## Data Models

### User
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed with bcrypt),
  role: String (enum: ["customer", "merchant", "admin"], default: "customer"),
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  _id: ObjectId,
  merchantId: ObjectId (ref: User, required),
  title: String (required),
  price: Number (required, min: 0),
  category: String (enum: ["Assets", "Fine Art", "Industrial", "Brands", "Collection"]),
  status: String (enum: ["DRAFT", "ACTIVE", "ARCHIVED"], default: "DRAFT"),
  averageRating: Number (min: 0, max: 5, default: 0),
  numOfReviews: Number (default: 0),
  images: [{
    url: String (required),
    isMain: Boolean (default: false)
  }],
  editorialNarrative: String,
  technicalSpecs: {
    primaryMaterial: String,
    finish: String,
    dimensions: { width: Number, height: Number, depth: Number },
    weightCapacity: Number,
    availablePalettes: [String]
  },
  inventory: {
    sku: String (required, unique, uppercase),
    stockQuantity: Number (required, min: 0, default: 0),
    lowStockAlert: Number (min: 0, default: 5),
    displayStockCount: Boolean (default: false)
  },
  shipping: {
    itemWeight: Number,
    packageDimensions: { length: Number, width: Number, height: Number },
    shippingClass: String (enum: ["Standard", "Fragile", "Heavy/Bulky", "Express Only"])
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  merchantId: ObjectId (ref: User, required, indexed),
  orderItems: [{
    name: String (required),
    quantity: Number (required),
    image: String,
    price: Number (required),
    product: ObjectId (ref: Product, required)
  }],
  shippingAddress: {
    address: String (required),
    city: String (required),
    postalCode: String (required),
    country: String (required)
  },
  paymentMethod: String (required, default: "Cash on Delivery"),
  totalPrice: Number (required, default: 0),
  status: String (enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending"),
  isPaid: Boolean (required, default: false),
  paidAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Customer
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, optional),
  name: String (required),
  email: String (required, unique, lowercase),
  avatar: String (default: placeholder),
  segment: String (enum: ["VIP", "New", "Inactive", "Regular"], default: "New"),
  orders: Number (default: 0),
  ltv: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Postman Collection

### Setup
1. Import the following requests into Postman
2. Set environment variable: `baseUrl = http://localhost:5000/api/v1`
3. Set environment variable: `accessToken` (obtained from login)
4. Set environment variable: `refreshToken` (obtained from login)

### Quick Test Flow

1. **Register**: `POST {{baseUrl}}/auth/register`
2. **Login**: `POST {{baseUrl}}/auth/login` → Save `accessToken`
3. **Get Profile**: `GET {{baseUrl}}/users/profile` → Add header `Authorization: Bearer {{accessToken}}`
4. **Get Products**: `GET {{baseUrl}}/products`
5. **Create Product**: `POST {{baseUrl}}/products` (form-data, multipart)
6. **Create Order**: `POST {{baseUrl}}/orders`
7. **Get Analytics**: `GET {{baseUrl}}/analytics/stats`

---

## Rate Limits

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Global API | 100 requests | 15 minutes |
| Auth endpoints | 10 requests | 1 hour |
| Password reset | 3 requests | 1 hour |
| Admin actions | 50 requests | 15 minutes |

Rate limit headers returned:
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1705305600
```

---

## CORS Policy

Allowed origins:
- `https://architectural-merchant-marketplace.onrender.com`
- `http://localhost:5173`
- `http://127.0.0.1:5173`

Allowed methods: GET, POST, PUT, DELETE, PATCH, OPTIONS  
Credentials: Enabled

---

## Versioning

Current API version: **v1**  
All endpoints prefixed with `/api/v1`

Future versions will be available at `/api/v2`, etc. Breaking changes will be introduced in new versions.
