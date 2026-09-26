import express from 'express';
import cors from 'cors';
import path from 'path'; 

import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import authRoutes from './modules/auth/auth.route.js'; 
import productRoutes from './modules/products/product.route.js';
import userRoutes from './modules/users/user.routes.js'; 
import orderRoutes from './modules/orders/order.route.js';
import analyticsRoutes from './modules/analytics/analytics.route.js';
import uploadRoutes from './modules/upload/upload.route.js';
import customerRoutes from './modules/customers/customer.route.js'; 
import paymentRoutes from './modules/payments/payment.routes.js';
import reviewRoutes from './modules/reviews/review.route.js';

import { errorHandler } from './middleware/error.middleware.js';
import { ApiError } from './utils/ApiError.js';

const app = express(); 

// ==========================================
// 1. GLOBAL MIDDLEWARES
// ==========================================
app.use((req, res, next) => {
  console.log(`=== 🚦 ROUTE TRACER: [${req.method}] ${req.url} ===`);
  next();
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(helmet());

app.use(cors({
  origin: [
    "https://architectural-merchant-marketplace.onrender.com", 
    "http://localhost:5173",
    "http://127.0.0.1:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true, 
}));

app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitize());
app.use(hpp());

const __dirname = path.resolve(); 
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// ==========================================
// 2. API ROUTES
// ==========================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/payments', paymentRoutes); 
app.use('/api/v1/reviews', reviewRoutes);

app.use((req, res, next) => {
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.use(errorHandler);

export default app;