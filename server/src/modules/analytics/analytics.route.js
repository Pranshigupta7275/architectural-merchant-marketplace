// SERVER/src/modules/analytics/analytics.route.js
import express from 'express';
import { getAnalyticsStats, getRecentTransactions } from './analytics.controller.js';
import { protect, authorizeRoles } from '../auth/auth.middleware.js';

const router = express.Router();

// ==========================================
// /api/analytics/stats
// ==========================================
router
  .route('/stats')
  .get(protect, authorizeRoles('admin', 'merchant'), getAnalyticsStats);

// ==========================================
// /api/analytics/recent-transactions
// ==========================================
router
  .route('/recent-transactions')
  .get(protect, authorizeRoles('admin', 'merchant'), getRecentTransactions);

export default router;