// SERVER/src/utils/token.util.js
import jwt from 'jsonwebtoken';

/**
 * Generates both Access and Refresh tokens for a user.
 * @param {string} userId - The MongoDB ObjectId of the user.
 * @param {string} role - The user's role (e.g., 'customer', 'merchant', 'admin').
 * @returns {Object} { accessToken, refreshToken }
 */
const generateTokens = (userId, role) => {
  // DEVELOPMENT MODE: Set to 30 days so your session doesn't expire while testing.
  // IMPORTANT: Before deploying to real users, change this back to '15m' or '1h'.
  const accessToken = jwt.sign(
    { id: userId, role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '30d' } 
  );

  const refreshToken = jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
};

// Use ES Module export
export default generateTokens;