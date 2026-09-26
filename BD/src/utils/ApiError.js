/**
 * @class ApiError
 * @extends Error
 * @description Custom error class for standardizing API responses
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error description
   * @param {boolean} [isOperational=true] - Whether the error is a predictable operational error
   * @param {string} [stack=''] - Custom stack trace
   */
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}