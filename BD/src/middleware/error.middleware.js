import { ApiError } from '../utils/ApiError.js';
import { logger } from './logger.middleware.js';

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new ApiError(400, message);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue ? Object.values(err.keyValue)[0] : err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new ApiError(400, message);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ApiError(400, message);
};

const handleJWTError = () =>
  new ApiError(401, 'Invalid token. Please log in again.');

const handleJWTExpiredError = () =>
  new ApiError(401, 'Your token has expired. Please log in again.');

const handleMulterError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new ApiError(400, 'File is too large. Please upload an image smaller than 5MB.');
  }
  return new ApiError(400, `Image upload failed: ${err.message}`);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.statusCode,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.statusCode,
      message: err.message,
    });
  } else {
    logger.error(`[CRITICAL ERROR] ${err.message}`, { stack: err.stack, error: err });
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Something went wrong on our end.',
    });
  }
};

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  let error = { ...err };
  error.name = err.name;
  error.message = err.message;
  error.code = err.code;
  error.isOperational = err.isOperational ?? false;

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
  if (error.name === 'MulterError') error = handleMulterError(error);

  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    sendErrorProd(error, res);
  } else {
    sendErrorDev(error, res);
  }
};
