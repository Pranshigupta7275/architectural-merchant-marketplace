import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUsers
} from './user.controller.js';
import { protect, authorizeRoles } from '../auth/auth.middleware.js';

const router = express.Router();

// ==========================================
// /api/v1/users/profile
// ==========================================
// Apply 'protect' middleware to ensure only logged-in users can access these
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// ==========================================
// /api/v1/users
// ==========================================
// Only Admins can view the full list of users
router.route('/')
  .get(protect, authorizeRoles('admin'), getUsers);

export default router;