import { z } from 'zod';
import { ApiError } from '../utils/ApiError.js';

/**
 * Generic Zod validation middleware factory.
 *
 * Usage:
 * validateRequest(schema, 'body')
 * validateRequest(schema, 'query')
 */
export const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = source === 'query' ? req.query : req.body;

    const result = schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));

      return next(
        new ApiError(
          400,
          `Invalid input data: ${JSON.stringify(errors)}`
        )
      );
    }

    if (source === 'body') {
      req.body = result.data;
    } else if (source === 'query') {
      req.query = result.data;
    }

    next();
  };
};

/**
 * ==============================
 * AUTH VALIDATION
 * ==============================
 */

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters'),

  email: z
    .string()
    .email('Please provide a valid email'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),

  role: z
    .enum(['customer', 'merchant', 'admin'])
    .optional(),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email('Please provide a valid email'),

  password: z
    .string()
    .min(1, 'Password is required'),
});

/**
 * ==============================
 * PRODUCT VALIDATION
 * ==============================
 *
 * Products are submitted using multipart/form-data.
 *
 * Therefore:
 * - Normal fields arrive as strings.
 * - price is coerced into a number.
 * - technicalSpecs, inventory and shipping
 *   arrive as JSON strings.
 *
 * They are parsed into objects later inside
 * createProduct() using parseIfString().
 */

export const createProductSchema = z.object({
  /**
   * Product title
   */
  title: z
    .string()
    .min(1, 'Title is required'),

  /**
   * FormData sends price as a string.
   *
   * Example:
   * "499.99" -> 499.99
   */
  price: z
    .coerce
    .number()
    .min(0, 'Price must be a positive number'),

  /**
   * Product category
   */
  category: z
    .string()
    .optional()
    .transform((val) =>
      val === '' ? undefined : val
    ),

  /**
   * Product status
   */
  status: z
    .enum(['DRAFT', 'ACTIVE', 'ARCHIVED'])
    .optional()
    .transform((val) =>
      val === '' ? undefined : val
    ),

  /**
   * FormData sends this as a JSON string.
   *
   * Example:
   * '{"primaryMaterial":"Wood","finish":"Walnut"}'
   */
  technicalSpecs: z
    .string()
    .optional()
    .transform((val) =>
      val === '' ? undefined : val
    ),

  /**
   * FormData sends the complete inventory
   * object as a JSON string.
   *
   * Example:
   * '{"sku":"API-TEST-CHAIR-001","stockQuantity":10}'
   */
  inventory: z
    .string()
    .optional()
    .transform((val) =>
      val === '' ? undefined : val
    ),

  /**
   * FormData sends shipping as a JSON string.
   */
  shipping: z
    .string()
    .optional()
    .transform((val) =>
      val === '' ? undefined : val
    ),
});