import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

// ✅ Corrected Path: Fetching ProductCard from the storefront subfolder
import ProductCard from "./storefront/ProductCard";

export default function Wishlist() {
  // Pull the liked items directly from your Redux store
  const wishlistItems = useSelector((state) => state.wishlist.items);

  return (
    <div className="w-full bg-ivory min-h-screen pt-32 pb-32">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        {/* Page Header */}
        <div className="mb-16 border-b border-stone-200 pb-8">
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
            Your Curations
          </h1>
          <p className="text-stone text-sm">
            Artifacts and objects you have saved for later review.
          </p>
        </div>

        {/* Conditional Rendering: Empty State vs Populated Grid */}
        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-6 text-stone-400">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-charcoal mb-3">
              Your collection is empty
            </h3>
            <p className="text-stone text-sm max-w-md mb-8">
              Explore our permanent collection and select the heart icon to
              curate your personal archive.
            </p>
            <Link
              to="/shop"
              className="px-8 py-4 bg-charcoal text-white text-[11px] font-bold tracking-widest uppercase hover:bg-brass transition-colors"
            >
              Explore the Archive
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
