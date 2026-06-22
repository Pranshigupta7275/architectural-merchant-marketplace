import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products = [],
  title,
  subtitle,
  isLoading = false,
  emptyMessage = "No pieces available in this collection.",
}) {
  // Framer Motion variants for a luxurious, staggered fade-in effect
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section className="w-full py-16 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Optional Section Header */}
        {(title || subtitle) && (
          <div className="flex flex-col items-center mb-12 text-center md:mb-16">
            {title && (
              <h2 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl uppercase">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="max-w-2xl mt-4 text-sm tracking-wide text-gray-500 md:text-base">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-100">
            <Loader2 className="w-8 h-8 text-[#111827] animate-spin mb-4" />
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
              Curating Collection...
            </p>
          </div>
        ) : products.length > 0 ? (
          /* Populated Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
          >
            {products.map((product) => (
              <motion.div
                key={product._id || product.id}
                variants={itemVariants}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <div className="flex items-center justify-center min-h-75 bg-gray-50/50 border border-gray-100 p-8 text-center">
            <p className="text-sm tracking-wide text-gray-500">
              {emptyMessage}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
