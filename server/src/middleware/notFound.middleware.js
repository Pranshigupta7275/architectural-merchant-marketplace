/**
 * Global 404 Handler Middleware
 * Catches all requests to unmapped routes.
 * * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: 'The requested resource could not be found.',
    details: {
      route: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    },
  });
};