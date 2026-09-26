import Product from '../products/product.model.js';
import Review from './review.model.js';
import { ApiError } from '../../utils/ApiError.js';

/**
 * @desc    Create a product review
 * @route   POST /api/v1/products/:id/reviews
 * @access  Private (Customer/Merchant/Admin)
 */
export const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (existingReview) {
      return next(new ApiError(400, 'You have already reviewed this product'));
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      comment,
    });

    await updateProductRatingStats(productId);

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(new ApiError(500, 'Error creating review', error.message));
  }
};

/**
 * @desc    Get product reviews
 * @route   GET /api/v1/products/:id/reviews
 * @access  Public
 */
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(new ApiError(500, 'Error fetching reviews', error.message));
  }
};

/**
 * @desc    Update product rating stats after review change
 */
export const updateProductRatingStats = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      numOfReviews: stats[0].numOfReviews,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      numOfReviews: 0,
    });
  }
};
