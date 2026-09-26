import express from 'express';

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from './product.controller.js';

import {
  protect,
  authorizeRoles,
} from '../auth/auth.middleware.js';

import {
  uploadProductImages,
} from '../../middleware/upload.middleware.js';

import {
  validateRequest,
  createProductSchema,
} from '../../middleware/validation.middleware.js';

const router = express.Router();

// ==========================================
// /api/v1/products
// ==========================================

router.route('/')
  /**
   * GET /api/v1/products
   * Public
   */
  .get(getProducts)

  /**
   * POST /api/v1/products
   * Private - Admin / Merchant
   *
   * Request format:
   * multipart/form-data
   */
  .post(
    // 1. Authentication
    protect,

    // 2. Authorization
    authorizeRoles('admin', 'merchant'),

    // 3. Auth debug middleware
    (req, res, next) => {
      console.log('✅ AUTH PASSED');
      next();
    },

    // 4. Handle product image uploads
    uploadProductImages.array('images', 5),

    // 5. Validate FormData fields
    validateRequest(createProductSchema),

    // 6. Multer / validation debug
    (req, res, next) => {
      console.log('✅ MULTER/VALIDATION PASSED');

      console.log(
        '📸 FILES:',
        req.files ? req.files.length : 0
      );

      console.log('📦 BODY:', req.body);

      next();
    },

    // 7. Create product
    createProduct
  );

// ==========================================
// /api/v1/products/:id
// ==========================================

router.route('/:id')

  /**
   * GET /api/v1/products/:id
   * Public
   */
  .get(getProductById)

  /**
   * PUT /api/v1/products/:id
   * Private - Admin / Merchant
   */
  .put(
    protect,
    authorizeRoles('admin', 'merchant'),

    uploadProductImages.array('images', 5),

    updateProduct
  )

  /**
   * DELETE /api/v1/products/:id
   * Private - Admin / Merchant
   */
  .delete(
    protect,
    authorizeRoles('admin', 'merchant'),
    deleteProduct
  );

export default router;