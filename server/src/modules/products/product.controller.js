// SERVER/src/modules/products/product.controller.js
import Product from './product.model.js';
import { ApiError } from '../../utils/ApiError.js';

/**
 * @desc    Fetch all products (with Search and Pagination)
 * @route   GET /api/v1/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    // Search Keyword setup
    const keyword = req.query.keyword
      ? {
          $or: [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { 'inventory.sku': { $regex: req.query.keyword, $options: 'i' } }
          ]
        }
      : {};

    // Execute Query in parallel for maximum performance
    const [count, products] = await Promise.all([
      Product.countDocuments(keyword),
      Product.find(keyword)
        .populate('merchantId', 'name email')
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ createdAt: -1 })
        .lean() // Highly optimized read-only query
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page,
        pages: Math.ceil(count / pageSize),
        totalProducts: count,
      }
    });
  } catch (error) {
    next(new ApiError(500, 'Error fetching products', error.message));
  }
};

/**
 * @desc    Fetch single product
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('merchantId', 'name email')
      .lean(); // Optimized read

    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(new ApiError(500, 'Error fetching product', error.message));
  }
};

/**
 * @desc    Create a product
 * @route   POST /api/v1/products
 * @access  Private (Merchant/Admin only)
 */
export const createProduct = async (req, res, next) => {
  try {
    // We can pass req.body directly because Mongoose validation strictly enforces the schema.
    // Any fields not in the schema are automatically stripped out.
    const product = await Product.create({
      ...req.body,
      merchantId: req.user._id,
      status: req.body.status || 'DRAFT',
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.code === 11000) {
      return next(new ApiError(400, 'A product with this SKU already exists.'));
    }
    next(new ApiError(500, 'Error creating product', error.message));
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/v1/products/:id
 * @access  Private (Merchant/Admin only)
 */
export const updateProduct = async (req, res, next) => {
  try {
    // Create query based on role. Admins can update any product, merchants only their own.
    const query = req.user.role === 'admin' 
      ? { _id: req.params.id } 
      : { _id: req.params.id, merchantId: req.user._id };

    // Find and update in a single atomic database call
    const updatedProduct = await Product.findOneAndUpdate(
      query,
      { $set: req.body }, // $set updates only the provided fields, leaving others intact
      { new: true, runValidators: true } // Returns updated doc, enforces schema rules
    );

    if (!updatedProduct) {
      return next(new ApiError(404, 'Product not found or unauthorized to update'));
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    if (error.code === 11000) {
      return next(new ApiError(400, 'A product with this SKU already exists.'));
    }
    next(new ApiError(500, 'Error updating product', error.message));
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/v1/products/:id
 * @access  Private (Merchant/Admin only)
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' 
      ? { _id: req.params.id } 
      : { _id: req.params.id, merchantId: req.user._id };

    const deletedProduct = await Product.findOneAndDelete(query);

    if (!deletedProduct) {
      return next(new ApiError(404, 'Product not found or unauthorized to delete'));
    }

    res.status(200).json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    next(new ApiError(500, 'Error deleting product', error.message));
  }
};