// src/modules/products/product.controller.js

import Product from './product.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { uploadBufferToCloudinary } from '../../middleware/upload.middleware.js';

/**
 * Helper function to safely parse JSON strings
 * received from multipart/form-data.
 *
 * Example:
 *
 * '{"sku":"CHAIR-001","stockQuantity":10}'
 *
 * becomes:
 *
 * {
 *   sku: "CHAIR-001",
 *   stockQuantity: 10
 * }
 */
const parseIfString = (val) => {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch (error) {
      console.warn(
        '⚠️ Warning: Failed to parse JSON string from frontend:',
        val
      );

      return val;
    }
  }

  return val;
};

/**
 * @desc    Fetch all products
 * @route   GET /api/v1/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    // ==========================================
    // Pagination
    // ==========================================

    const pageSize = Math.max(
      1,
      parseInt(req.query.limit, 10) || 10
    );

    const page = Math.max(
      1,
      parseInt(req.query.page, 10) || 1
    );

    // ==========================================
    // Build Query
    // ==========================================

    const queryObj = {};

    // Keyword search
    if (
      req.query.keyword &&
      req.query.keyword.trim() !== ''
    ) {
      queryObj.$text = {
        $search: req.query.keyword.trim(),
      };
    }

    // Category filter
    if (
      req.query.category &&
      req.query.category.trim() !== ''
    ) {
      queryObj.category = {
        $regex: req.query.category.trim(),
        $options: 'i',
      };
    }

    // Status filter
    if (
      req.query.status &&
      req.query.status.trim() !== ''
    ) {
      queryObj.status = req.query.status.trim();
    }

    // ==========================================
    // Price Filtering
    // ==========================================

    const minP = parseFloat(req.query.minPrice);
    const maxP = parseFloat(req.query.maxPrice);

    if (!isNaN(minP) || !isNaN(maxP)) {
      queryObj.price = {};

      if (!isNaN(minP)) {
        queryObj.price.$gte = minP;
      }

      if (!isNaN(maxP)) {
        queryObj.price.$lte = maxP;
      }
    }

    // ==========================================
    // Sorting
    // ==========================================

    const hasKeyword =
      req.query.keyword &&
      req.query.keyword.trim() !== '';

    const sortOption = hasKeyword
      ? {
          score: {
            $meta: 'textScore',
          },
        }
      : {
          createdAt: -1,
        };

    // ==========================================
    // Projection
    // ==========================================

    const projection = hasKeyword
      ? {
          score: {
            $meta: 'textScore',
          },
        }
      : undefined;

    // ==========================================
    // Database Queries
    // ==========================================

    const [count, products] = await Promise.all([
      Product.countDocuments(queryObj),

      Product.find(
        queryObj,
        projection
      )
        .populate(
          'merchantId',
          'name email'
        )
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort(sortOption)
        .lean(),
    ]);

    // ==========================================
    // Response
    // ==========================================

    return res.status(200).json({
      success: true,

      data: products,

      pagination: {
        page,
        pages: Math.ceil(
          count / pageSize
        ),
        totalProducts: count,
      },
    });
  } catch (error) {
    console.error(
      '❌ Error fetching products:',
      error
    );

    next(
      new ApiError(
        500,
        'Error fetching products',
        error.message
      )
    );
  }
};

/**
 * @desc    Fetch single product
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
export const getProductById = async (
  req,
  res,
  next
) => {
  try {
    console.log(
      `🚦 ROUTE TRACER: [GET] /api/v1/products/${req.params.id}`
    );

    const product =
      await Product.findById(req.params.id)
        .populate(
          'merchantId',
          'name email'
        )
        .lean();

    // Product not found
    if (!product) {
      console.log(
        `❌ Product not found: ${req.params.id}`
      );

      return next(
        new ApiError(
          404,
          'Product not found'
        )
      );
    }

    console.log(
      `✅ Product found: ${product.title}`
    );

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(
      '❌ Error fetching product:',
      error
    );

    next(
      new ApiError(
        500,
        'Error fetching product',
        error.message
      )
    );
  }
};

/**
 * @desc    Create a product
 * @route   POST /api/v1/products
 * @access  Private - Merchant/Admin only
 */
export const createProduct = async (
  req,
  res,
  next
) => {
  try {
    console.log(
      '🚦 TRACE 1: Entered createProduct controller!'
    );

    console.log(
      '🖼️ Files received in memory:',
      req.files
        ? req.files.length
        : 0
    );

    console.log(
      '📦 Body received:',
      req.body
    );

    // ==========================================
    // Base Product Data
    // ==========================================

    let productData = {
      ...req.body,
      merchantId: req.user._id,
    };

    // ==========================================
    // Convert Price
    // ==========================================

    if (
      productData.price !== undefined &&
      productData.price !== null &&
      productData.price !== ''
    ) {
      productData.price =
        Number(productData.price);
    }

    // ==========================================
    // Upload Product Images
    // ==========================================

    if (
      req.files &&
      req.files.length > 0
    ) {
      console.log(
        '☁️ Uploading images to Cloudinary...'
      );

      const uploadPromises =
        req.files.map((file) =>
          uploadBufferToCloudinary(
            file.buffer
          )
        );

      const uploadResults =
        await Promise.all(
          uploadPromises
        );

      productData.images =
        uploadResults.map(
          (result, index) => ({
            url: result.secure_url,
            isMain: index === 0,
          })
        );

      console.log(
        '✅ Cloudinary upload successful!'
      );
    }

    // ==========================================
    // Parse Nested FormData Fields
    // ==========================================

    if (
      req.body.technicalSpecs
    ) {
      productData.technicalSpecs =
        parseIfString(
          req.body.technicalSpecs
        );
    }

    if (
      req.body.inventory
    ) {
      productData.inventory =
        parseIfString(
          req.body.inventory
        );
    }

    if (
      req.body.shipping
    ) {
      productData.shipping =
        parseIfString(
          req.body.shipping
        );
    }

    // ==========================================
    // Default Status
    // ==========================================

    productData.status =
      req.body.status || 'DRAFT';

    // ==========================================
    // Create Product
    // ==========================================

    const product =
      await Product.create(
        productData
      );

    console.log(
      '✅ Product created successfully:',
      product._id
    );

    // ==========================================
    // Response
    // ==========================================

    return res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(
      '❌ Error in createProduct:',
      error
    );

    // ==========================================
    // Duplicate SKU
    // ==========================================

    if (error.code === 11000) {
      return next(
        new ApiError(
          400,
          'A product with this SKU already exists. Please use a unique SKU.'
        )
      );
    }

    // ==========================================
    // General Error
    // ==========================================

    next(
      new ApiError(
        500,
        'Error creating product',
        error.message
      )
    );
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/v1/products/:id
 * @access  Private - Merchant/Admin only
 */
export const updateProduct = async (
  req,
  res,
  next
) => {
  try {
    // ==========================================
    // Authorization Query
    // ==========================================

    const query =
      req.user.role === 'admin'
        ? {
            _id: req.params.id,
          }
        : {
            _id: req.params.id,
            merchantId: req.user._id,
          };

    // ==========================================
    // Base Update Data
    // ==========================================

    let updateData = {
      ...req.body,
    };

    // ==========================================
    // Convert Price
    // ==========================================

    if (
      updateData.price !== undefined &&
      updateData.price !== null &&
      updateData.price !== ''
    ) {
      updateData.price =
        Number(updateData.price);
    }

    // ==========================================
    // Upload New Images
    // ==========================================

    if (
      req.files &&
      req.files.length > 0
    ) {
      console.log(
        '☁️ Uploading new images to Cloudinary...'
      );

      const uploadPromises =
        req.files.map((file) =>
          uploadBufferToCloudinary(
            file.buffer
          )
        );

      const uploadResults =
        await Promise.all(
          uploadPromises
        );

      updateData.images =
        uploadResults.map(
          (result, index) => ({
            url: result.secure_url,
            isMain: index === 0,
          })
        );

      console.log(
        '✅ New images uploaded successfully!'
      );
    }

    // ==========================================
    // Parse Nested FormData Fields
    // ==========================================

    if (
      req.body.technicalSpecs
    ) {
      updateData.technicalSpecs =
        parseIfString(
          req.body.technicalSpecs
        );
    }

    if (
      req.body.inventory
    ) {
      updateData.inventory =
        parseIfString(
          req.body.inventory
        );
    }

    if (
      req.body.shipping
    ) {
      updateData.shipping =
        parseIfString(
          req.body.shipping
        );
    }

    // ==========================================
    // Update Product
    // ==========================================

    const updatedProduct =
      await Product.findOneAndUpdate(
        query,
        {
          $set: updateData,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    // ==========================================
    // Product Not Found / Unauthorized
    // ==========================================

    if (!updatedProduct) {
      return next(
        new ApiError(
          404,
          'Product not found or unauthorized to update'
        )
      );
    }

    console.log(
      '✅ Product updated successfully:',
      updatedProduct._id
    );

    // ==========================================
    // Response
    // ==========================================

    return res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error(
      '❌ Error in updateProduct:',
      error
    );

    // ==========================================
    // Duplicate SKU
    // ==========================================

    if (error.code === 11000) {
      return next(
        new ApiError(
          400,
          'A product with this SKU already exists.'
        )
      );
    }

    // ==========================================
    // General Error
    // ==========================================

    next(
      new ApiError(
        500,
        'Error updating product',
        error.message
      )
    );
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/v1/products/:id
 * @access  Private - Merchant/Admin only
 */
export const deleteProduct = async (
  req,
  res,
  next
) => {
  try {
    // ==========================================
    // Authorization Query
    // ==========================================

    const query =
      req.user.role === 'admin'
        ? {
            _id: req.params.id,
          }
        : {
            _id: req.params.id,
            merchantId: req.user._id,
          };

    // ==========================================
    // Delete Product
    // ==========================================

    const deletedProduct =
      await Product.findOneAndDelete(
        query
      );

    // ==========================================
    // Product Not Found / Unauthorized
    // ==========================================

    if (!deletedProduct) {
      return next(
        new ApiError(
          404,
          'Product not found or unauthorized to delete'
        )
      );
    }

    console.log(
      '✅ Product deleted successfully:',
      req.params.id
    );

    // ==========================================
    // Response
    // ==========================================

    return res.status(200).json({
      success: true,
      message:
        'Product removed successfully',
    });
  } catch (error) {
    console.error(
      '❌ Error deleting product:',
      error
    );

    next(
      new ApiError(
        500,
        'Error deleting product',
        error.message
      )
    );
  }
};