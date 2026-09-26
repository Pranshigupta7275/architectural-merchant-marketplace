import express from 'express';
import { getCustomers, seedCustomers } from './customer.controller.js';
import { protect, authorizeRoles } from '../auth/auth.middleware.js';

const router = express.Router();

// ==========================================
// SEED ROUTE (Must go above /)
// ==========================================
// Only admins should be allowed to wipe and seed the database
router.route('/seed')
  .post(protect, authorizeRoles('admin'), seedCustomers);

// ==========================================
// MAIN ROUTES
// ==========================================
// Only merchants and admins can view the customer directory
router.route('/')
  .get(protect, authorizeRoles('admin', 'merchant'), getCustomers);

export default router;