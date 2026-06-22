// SERVER/src/modules/analytics/analytics.controller.js
import Product from '../products/product.model.js';
import Order from '../orders/order.model.js';
import { ApiError } from '../../utils/ApiError.js';

/**
 * @desc    Get dashboard metrics (KPIs + Revenue Chart)
 * @route   GET /api/v1/analytics/stats
 * @access  Private (Merchant/Admin)
 */
export const getAnalyticsStats = async (req, res, next) => {
  try {
    // 1. Dynamic Scope: Admins see the whole platform, Merchants see their own store
    const matchStage = req.user.role === 'admin' 
      ? {} 
      : { merchantId: req.user._id };

    // 2. Parallel Database Queries for maximum speed
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalRevenueResult, activeListings, revenueData] = await Promise.all([
      // A. Total Revenue (Only counting Delivered orders)
      Order.aggregate([
        { $match: { ...matchStage, status: 'Delivered' } }, // FIXED: Matched to Schema Enum
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),

      // B. Active Listings Count
      Product.countDocuments({ 
        ...matchStage, 
        status: 'ACTIVE' // Matches your Product schema enum
      }),

      // C. Revenue Trend Aggregation (Last 30 Days)
      Order.aggregate([
        { 
          $match: { 
            ...matchStage, 
            createdAt: { $gte: thirtyDaysAgo } 
          } 
        },
        {
          $group: {
            // Groups by YYYY-MM-DD for frontend charts
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$totalPrice" }
          }
        },
        { $sort: { "_id": 1 } }, // Sort chronologically
        { 
          $project: { 
            _id: 0, 
            date: "$_id", 
            revenue: 1 
          } 
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: totalRevenueResult[0]?.total || 0,
        activeListings,
        conversionRate: 3.82, // Future scaling: hook into a Session logs collection
        revenueData // Perfectly formatted for Recharts/Chart.js [{date: "2026-06-15", revenue: 1200}]
      }
    });

  } catch (error) {
    next(new ApiError(500, 'Error calculating analytics', error.message));
  }
};

/**
 * @desc    Get Recent Transactions
 * @route   GET /api/v1/analytics/recent-transactions
 * @access  Private (Merchant/Admin)
 */
export const getRecentTransactions = async (req, res, next) => {
  try {
    const matchStage = req.user.role === 'admin' 
      ? {} 
      : { merchantId: req.user._id };

    const transactions = await Order.find(matchStage)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email') // Gets the customer details
      .populate('orderItems.product', 'title images price') // Gets the product specifics
      .lean(); // Strips Mongoose wrappers for lighting-fast JSON parsing

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    next(new ApiError(500, 'Error fetching transactions', error.message));
  }
};