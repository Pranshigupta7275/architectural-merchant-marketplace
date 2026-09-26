import express from 'express';
import { getAnalyticsStats, getRecentTransactions, getAnalyticsSummary } from './analytics.controller.js';
import { protect, authorizeRoles } from '../auth/auth.middleware.js';

const router = express.Router();

// ==========================================
// MIDDLEWARE CHAIN
// ==========================================
// Apply protection and RBAC to all analytics routes
router.use(protect);
router.use(authorizeRoles('admin', 'merchant'));

// ==========================================
// ROUTES
// ==========================================

router.route('/stats')
  .get(getAnalyticsStats);

router.route('/recent-transactions')
  .get(getRecentTransactions);

router.route('/summary')
  .get(getAnalyticsSummary);

export default router;