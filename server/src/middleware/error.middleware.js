import { ApiError } from '../utils/ApiError.js';
import { logger } from './logger.middleware.js';

/**
 * Handles MongoDB CastErrors (e.g., invalid ObjectId)
 * @param {Error} err - The error object
 * @returns {ApiError} Standardized API Error
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new ApiError(400, message);
};

/**
 * Handles MongoDB Duplicate Key Errors
 * @param {Error} err - The error object
 * @returns {ApiError} Standardized API Error
 */
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new ApiError(400, message);
};

/**
 * Handles Mongoose Validation Errors
 * @param {Error} err - The error object
 * @returns {ApiError} Standardized API Error
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ApiError(400, message);
};

/**
 * Handles JWT Invalid Signature/Format Errors
 * @returns {ApiError} Standardized API Error
 */
const handleJWTError = () =>
  new ApiError(401, 'Invalid token. Please log in again.');

/**
 * Handles JWT Expired Errors
 * @returns {ApiError} Standardized API Error
 */
const handleJWTExpiredError = () =>
  new ApiError(401, 'Your token has expired. Please log in again.');

/**
 * Development Error Dispatcher
 * @param {ApiError} err - The error object
 * @param {Object} res - Express response object
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.statusCode,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

/**
 * Production Error Dispatcher
 * @param {ApiError} err - The error object
 * @param {Object} res - Express response object
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.statusCode,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error(`[CRITICAL ERROR] 💥: ${err.message}`, err);

    res.status(500).json({
      success: false,
      status: 500,
      message: 'Something went wrong on our end.',
    });
  }
};

/**
 * Global Error Handling Middleware
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    error.message = err.message;

    // Intercept specific known errors and convert them to operational ApiErrors
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};