import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Heart, Star, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

import { addItemToCart } from '../features/cart/cartSlice';
import { toggleWishlist } from '../features/wishlist/wishlistSlice';
import { useGetStorefrontProductByIdQuery, useGetProductReviewsQuery, useCreateProductReviewMutation } from '../features/api/customerApi';
import { Skeleton } from '../components/ui/Skeleton';

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    data: productResponse,
    isLoading,
    isError,
  } = useGetStorefrontProductByIdQuery(id);

  const { data: reviewsResponse, isLoading: reviewsLoading } = useGetProductReviewsQuery(id);
  const [createReview, { isLoading: isSubmittingReview }] = useCreateProductReviewMutation();

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const product = productResponse?.data || productResponse;

  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const productId = product?._id || product?.id;

  const isLiked = wishlistItems.some(
    (item) => String(item._id || item.id) === String(productId)
  );

  const handleAddToCart = () => {
    if (product) {
      dispatch(addItemToCart({ ...product, id: productId, quantity: 1 }));
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      dispatch(toggleWishlist({ ...product, id: productId }));
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (reviewRating === 0) {
      setReviewError('Please select a rating');
      return;
    }

    try {
      await createReview({
        productId: id,
        rating: reviewRating,
        comment: reviewComment,
      }).unwrap();

      setReviewSuccess('Review submitted successfully!');
      setReviewRating(0);
      setReviewComment('');
    } catch (err) {
      setReviewError(err?.data?.message || 'Failed to submit review');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-ivory min-h-screen pt-32 pb-32 flex justify-center items-center">
        <div className="space-y-4 w-full max-w-4xl px-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="w-full bg-ivory min-h-screen pt-32 pb-32 flex flex-col justify-center items-center">
        <p className="text-stone text-sm mb-6">Artifact not found or no longer available.</p>
        <Link
          to="/shop"
          className="text-[11px] font-bold tracking-widest uppercase text-charcoal border-b border-charcoal pb-1"
        >
          Return to Archive
        </Link>
      </div>
    );
  }

  const reviews = reviewsResponse?.data || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full bg-ivory min-h-screen pt-32 pb-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        <Link
          to="/shop"
          className="text-[10px] font-bold tracking-widest uppercase text-stone hover:text-charcoal transition-colors mb-12 inline-block"
        >
          ← Back to Collection
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Image Container */}
          <div className="aspect-[4/5] bg-stone-100 flex items-center justify-center overflow-hidden">
            <img
              src={
                product.image ||
                product.images?.[0]?.url ||
                product.images?.[0] ||
                "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40"
              }
              alt={product.title || product.name}
              className="w-full h-full object-cover mix-blend-multiply"
            />
          </div>

          {/* Details Container */}
          <div className="pt-8 sticky top-32">
            <h1 className="font-serif text-4xl text-charcoal mb-4">
              {product.title || product.name}
            </h1>

            <p className="text-[11px] font-bold tracking-widest uppercase text-stone mb-8">
              {product.category}
            </p>

            <div className="text-2xl font-medium text-charcoal mb-8">
              $
              {(product.price || 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-[#2E8B57]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= (product.averageRating || 0)
                        ? 'fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.averageRating?.toFixed(1) || '0.0'} ({product.numOfReviews || 0} reviews)
              </span>
            </div>

            <p className="text-stone text-sm leading-relaxed mb-12">
              {product.description ||
                "An evolving archive of architectural hardware, industrial lighting, and bespoke objects. Sourced globally for the meticulous curator."}
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-3 py-4 bg-charcoal text-white text-[11px] font-bold tracking-widest uppercase hover:bg-brass transition-colors shadow-md cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>

              <button
                onClick={handleToggleWishlist}
                className="w-full flex items-center justify-center gap-3 py-4 border border-stone-200 text-charcoal text-[11px] font-bold tracking-widest uppercase hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 transition-colors duration-300 ${
                    isLiked ? "fill-red-500 text-red-500" : "text-stone"
                  }`}
                />
                {isLiked ? "Remove from Wishlist" : "Save to Wishlist"}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24 max-w-4xl">
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-8">
            Customer Reviews ({reviews.length})
          </h2>

          {/* Review Form */}
          <form onSubmit={handleSubmitReview} className="bg-white p-6 rounded-xl border border-gray-200 mb-12 space-y-4">
            <h3 className="text-lg font-bold text-charcoal">Write a Review</h3>

            {reviewError && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                {reviewError}
              </div>
            )}
            {reviewSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-200">
                {reviewSuccess}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= reviewRating
                          ? 'fill-[#2E8B57] text-[#2E8B57]'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none transition-all resize-none"
                placeholder="Share your thoughts about this product..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="px-6 py-2.5 bg-[#111827] text-white text-sm font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-12">
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white p-6 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-bold text-charcoal">
                        {review.user?.name || 'Anonymous'}
                      </p>
                      <div className="flex text-[#2E8B57] mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
