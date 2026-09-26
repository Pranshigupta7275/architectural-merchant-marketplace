// SERVER/src/utils/token.util.js
import jwt from 'jsonwebtoken';

/**
 * Generates both Access and Refresh tokens for a user.
 * @param {string} userId - The MongoDB ObjectId of the user.
 * @param {string} role - The user's role (e.g., 'customer', 'merchant', 'admin').
 * @returns {Object} { accessToken, refreshToken }
 */
const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export default generateTokens;
