import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, isLoading, onClearFilters }) {
  // --- Framer Motion Variants ---
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { ease: [0.16, 1, 0.3, 1], duration: 0.6 },
    },
  };

  // 1. Premium Skeleton Loader
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-4/5 bg-stone/10 mb-4" />
            <div className="h-3 bg-stone/10 w-1/3 mb-3" />
            <div className="h-4 bg-stone/20 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  // 2. Premium Empty State
  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-32 flex flex-col items-center justify-center text-center"
      >
        <div className="w-16 h-16 border border-stone/20 flex items-center justify-center rounded-full mb-6 text-stone">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="font-serif text-2xl text-charcoal mb-3">
          No curations match your criteria.
        </h3>
        <p className="text-stone text-sm max-w-md mb-8">
          Consider expanding your search parameters or clearing your filters to
          discover our permanent collection.
        </p>
        <button
          onClick={onClearFilters}
          className="border-b border-charcoal pb-1 text-[11px] font-bold tracking-widest uppercase text-charcoal hover:text-brass hover:border-brass transition-colors cursor-pointer"
        >
          Clear All Filters
        </button>
      </motion.div>
    );
  }

  // 3. Populated Grid
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariant}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
