import User from './user.model.js';
import { ApiError } from '../../utils/ApiError.js';

/**
 * @desc    Get logged in user profile
 * @route   GET /api/v1/users/profile
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password').lean();
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(new ApiError(500, 'Error fetching profile', error.message));
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password; // The pre-save hook will hash this automatically
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new ApiError(400, 'Email already in use.'));
    }
    next(new ApiError(500, 'Error updating profile', error.message));
  }
};

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').lean();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(new ApiError(500, 'Error fetching users', error.message));
  }
};