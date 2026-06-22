// SERVER/src/modules/upload/upload.route.js
import express from 'express';
import { upload } from '../../utils/upload.util.js';
import { protect, authorizeRoles } from '../auth/auth.middleware.js';

const router = express.Router();

// @route   POST /api/v1/upload
// @desc    Upload a single image
// @access  Private (Merchant/Admin only)
router.post('/', protect, authorizeRoles('merchant', 'admin'), upload.single('image'), (req, res) => {
  // 1. Check if Multer successfully processed the file
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  // 2. Build the exact web URL your frontend needs
  // We use req.file.filename instead of req.file.path to avoid the C:/ drive absolute path
  const imagePath = `/uploads/${req.file.filename}`;

  // 3. Send the clean web link back to the frontend
  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    data: {
      url: imagePath
    }
  });
});

export default router;