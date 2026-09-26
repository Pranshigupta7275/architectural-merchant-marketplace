import express from 'express';
import {
  createStripeIntent,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from './payment.controller.js';

const router = express.Router();

router.post('/stripe/create-intent', createStripeIntent);
router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify-payment', verifyRazorpayPayment);

export default router;