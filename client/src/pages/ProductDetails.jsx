import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingBag, Heart } from "lucide-react";
import { motion } from "framer-motion";

import { addItemToCart } from "../features/cart/cartSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import { useGetStorefrontProductByIdQuery } from "../features/api/customerApi";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    data: product,
    isLoading,
    isError,
  } = useGetStorefrontProductByIdQuery(id);

  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const productId = product?._id || product?.id;
  const isLiked = wishlistItems.some(
    (item) => String(item._id || item.id) === String(productId),
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

  if (isLoading) {
    return (
      <div className="w-full bg-ivory min-h-screen pt-32 pb-32 flex justify-center items-center">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone animate-pulse">
          Retrieving Artifact...
        </p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="w-full bg-ivory min-h-screen pt-32 pb-32 flex flex-col justify-center items-center">
        <p className="text-stone text-sm mb-6">
          Artifact not found or no longer available.
        </p>
        <Link
          to="/shop"
          className="text-[11px] font-bold tracking-widest uppercase text-charcoal border-b border-charcoal pb-1"
        >
          Return to Archive
        </Link>
      </div>
    );
  }

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
                product.images?.[0] ||
                "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40"
              }
              alt={product.name}
              className="w-full h-full object-cover mix-blend-multiply"
            />
          </div>

          {/* Details Container */}
          <div className="pt-8 sticky top-32">
            <h1 className="font-serif text-4xl text-charcoal mb-4">
              {product.name}
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

            <p className="text-stone text-sm leading-relaxed mb-12">
              {product.description ||
                "An evolving archive of architectural hardware, industrial lighting, and bespoke objects. Sourced globally for the meticulous curator."}
            </p>

            <div className="flex flex-col gap-4">
              {/* PRIMARY ACTION: Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-3 py-4 bg-charcoal text-white text-[11px] font-bold tracking-widest uppercase hover:bg-brass transition-colors shadow-md cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>

              {/* SECONDARY ACTION: Wishlist */}
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
      </div>
    </motion.div>
  );
}
