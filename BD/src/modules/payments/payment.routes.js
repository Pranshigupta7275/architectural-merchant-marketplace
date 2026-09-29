import express from 'express';
import {
  createStripeIntent,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from './payment.controller.js';
import { protect } from '../auth/auth.middleware.js';

const router = express.Router();

// All payment routes require authentication
router.use(protect);

router.post('/stripe/create-intent', createStripeIntent);
router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify-payment', verifyRazorpayPayment);

export default router;