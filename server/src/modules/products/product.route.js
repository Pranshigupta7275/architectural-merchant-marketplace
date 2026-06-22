// SERVER/src/modules/products/product.route.js
import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from './product.controller.js'; 

import { protect, authorizeRoles } from '../auth/auth.middleware.js';

const router = express.Router();

// ==========================================
// /api/products
// ==========================================
router.route('/')
  .get(getProducts) // Anyone can view products
  .post(protect, authorizeRoles('admin', 'merchant'), createProduct); // Only authorized roles can create

// ==========================================
// /api/products/:id
// ==========================================
router.route('/:id')
  .get(getProductById) // Anyone can view a single product
  .put(protect, authorizeRoles('admin', 'merchant'), updateProduct)
  .delete(protect, authorizeRoles('admin', 'merchant'), deleteProduct);

export default router;