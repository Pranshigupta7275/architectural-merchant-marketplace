// SERVER/src/modules/orders/order.route.js
import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
} from './order.controller.js';

import { protect, authorizeRoles } from '../auth/auth.middleware.js';

const router = express.Router();

// ==========================================
// SPECIFIC ROUTES (Must go before /:id)
// ==========================================
// Customers can securely fetch their own personal orders
router.get('/myorders', protect, getMyOrders);

// ==========================================
// DYNAMIC ID ROUTES
// ==========================================
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

// ==========================================
// ROOT ROUTES (/)
// ==========================================
// SECURITY FIX: Only Admins and Merchants can view the master list of all orders
router.get('/', protect, authorizeRoles('admin', 'merchant'), getOrders);

// Anyone with a valid account can create an order
router.post('/', protect, addOrderItems);

export default router;