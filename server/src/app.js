// SERVER/src/app.js
import express from 'express';
import cors from 'cors';
import path from 'path'; 

import authRoutes from './modules/auth/auth.route.js'; 
import productRoutes from './modules/products/product.route.js';
import userRoutes from './modules/users/user.routes.js'; 
import orderRoutes from './modules/orders/order.route.js';
import analyticsRoutes from './modules/analytics/analytics.route.js';
import uploadRoutes from './modules/upload/upload.route.js';
import customerRoutes from './modules/customers/customer.route.js'; 

const app = express();

app.use((req, res, next) => {
  console.log("=== NEW REQUEST RECEIVED ===");
  console.log("1. Content-Type Header:", req.headers['content-type']);
  next();
});

app.use(cors());
app.use(express.json());

// Set up static folder for viewing uploaded images
const __dirname = path.resolve(); 
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);
// 2. MOUNT THE CUSTOMER ROUTE
app.use('/api/customers', customerRoutes);

export default app;