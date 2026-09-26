// SERVER/src/modules/auth/auth.middleware.js
import jwt from 'jsonwebtoken';
import User from '../users/user.model.js'; // FIXED: Pointing to the Model, not the Route
import { ApiError } from '../../utils/ApiError.js'; // Standardized Error Handling

/**
 * @desc    Middleware to protect routes (Requires valid JWT)
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user, exclude password, and use .lean() for performance
      req.user = await User.findById(decoded.id).select('-password').lean();

      if (!req.user) {
        return next(new ApiError(401, 'Not authorized, user no longer exists'));
      }

      return next(); // Success! Move to the next middleware or controller
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      return next(new ApiError(401, 'Not authorized, token failed or expired'));
    }
  }

  // 2. Handle missing token
  if (!token) {
    return next(new ApiError(401, 'Not authorized, no token provided'));
  }
};

/**
 * @desc    Middleware to restrict access to specific roles
 * @param   {...string} roles - Spread array of allowed roles
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Ensure req.user exists (protect must be called first in the route chain)
    if (!req.user) {
      return next(new ApiError(401, 'Not authorized, please log in first'));
    }

    // Check if the user's role is permitted
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Role (${req.user.role}) is not allowed to access this resource`)
      );
    }
    
    next();
  };
};