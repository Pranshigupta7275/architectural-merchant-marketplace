import rateLimit from 'express-rate-limit';

/**
 * Standardizes the rate limit error response
 * @param {number} maxRequests - Maximum allowed requests
 * @param {number} windowMinutes - Time window in minutes
 * @returns {Object} JSON response object
 */
const generateLimitResponse = (maxRequests, windowMinutes) => ({
  success: false,
  status: 429,
  message: `Too many requests. Limit is ${maxRequests} requests per ${windowMinutes} minutes. Please try again later.`,
});

/**
 * Global Rate Limiter: Applies to all standard API routes
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: generateLimitResponse(100, 15),
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Authentication Limiter: Protects login/register routes from brute-force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 failed/successful auth requests per hour
  message: generateLimitResponse(10, 60),
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Password Reset Limiter: Highly restrictive to prevent email spam/OTP brute force
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: generateLimitResponse(3, 60),
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Admin Action Limiter: Protects high-privilege endpoints
 */
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: generateLimitResponse(50, 15),
  standardHeaders: true,
  legacyHeaders: false,
});