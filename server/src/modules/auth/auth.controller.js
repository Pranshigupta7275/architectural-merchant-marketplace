// SERVER/src/modules/auth/auth.controller.js
import User from '../users/user.model.js';
import generateTokens from '../../utils/token.util.js';
import jwt from 'jsonwebtoken';
import { ApiError } from '../../utils/ApiError.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return next(new ApiError(400, 'Please provide all required fields.'));
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ApiError(400, 'User already exists with this email.'));
    }

    // 3. Create User
    const user = await User.create({
      name,
      email,
      password, 
      role: role || 'customer',
    });

    // 4. Generate Tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    // 1. Print the raw error in red text to your terminal
    console.error("🔥 CRITICAL REGISTRATION ERROR:", error);

    // 2. Safely pass the actual error message forward
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
}; // <--- THIS BRACKET WAS MISSING

/**
 * @desc    Authenticate user & get tokens
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, 'Please provide email and password.'));
    }

    const user = await User.findOne({ email });

    // Use the custom model method to verify the password securely
    if (user && (await user.matchPassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id, user.role);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      });
    } else {
      return next(new ApiError(401, 'Invalid credentials.'));
    }
  } catch (error) {
    next(new ApiError(500, 'Server error during login', error.message));
  }
};

/**
 * @desc    Refresh Access Token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return next(new ApiError(401, 'Refresh token is required.'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).lean();
    if (!user) {
      return next(new ApiError(401, 'Invalid refresh token, user not found.'));
    }

    const newTokens = generateTokens(user._id, user.role);

    res.status(200).json({
      success: true,
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    });
  } catch (error) {
    next(new ApiError(401, 'Refresh token is expired or invalid.'));
  }
};

/**
 * @desc    Logout User
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logoutUser = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};