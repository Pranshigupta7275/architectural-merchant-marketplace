import express from 'express';
import {
  createProductReview,
  getProductReviews,
} from './review.controller.js';
import { protect } from '../auth/auth.middleware.js';

const router = express.Router();

router.route('/:id')
  .get(getProductReviews)
  .post(protect, createProductReview);

export default router;
