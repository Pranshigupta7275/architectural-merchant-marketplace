// SERVER/src/modules/auth/auth.controller.js
import User from '../users/user.model.js';
import generateTokens from '../../utils/token.util.js';
import jwt from 'jsonwebtoken';
import { ApiError } from '../../utils/ApiError.js';

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ApiError(400, 'User already exists with this email.'));
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
    });

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(new ApiError(500, 'Server error during registration', true, error.message));
  }
};

/**
 * @desc    Authenticate user & get tokens
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, 'Please provide email and password.'));
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id, user.role);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      });
    }

    return next(new ApiError(401, 'Invalid credentials.'));
  } catch (error) {
    next(new ApiError(500, 'Server error during login', true, error.message));
  }
};

/**
 * @desc    Refresh Access Token using httpOnly refresh token cookie
 * @route   POST /api/v1/auth/refresh
 * @access  Public
 */
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return next(new ApiError(401, 'Refresh token is required.'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).lean();
    if (!user) {
      return next(new ApiError(401, 'Invalid refresh token, user not found.'));
    }

    const newTokens = generateTokens(user._id, user.role);

    res.cookie('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      accessToken: newTokens.accessToken,
    });
  } catch (error) {
    next(new ApiError(401, 'Refresh token is expired or invalid.'));
  }
};

/**
 * @desc    Logout User
 * @route   POST /api/v1/auth/logout
 * @access  Public
 */
export const logoutUser = (req, res, next) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
