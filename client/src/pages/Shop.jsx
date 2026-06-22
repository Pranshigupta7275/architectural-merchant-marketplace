import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

// ✅ 1. IMPORT YOUR RTK QUERY HOOK
import { useGetProductsQuery } from "../features/api/customerApi";

// --- COMPONENTS ---
import FilterDrawer from "./storefront/FilterDrawer";
import ProductGrid from "./storefront/ProductGrid";
import ShopToolbar from "../layout/ShopToolbar"; // Update path if needed

export default function Shop() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 2. EXTRACT URL PARAMETERS
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const categoryQuery = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "";

  // ✅ 3. FETCH REAL DATA FROM YOUR BACKEND
  // Passes all active URL filters directly to your API
  const { data, isLoading, isFetching } = useGetProductsQuery({
    search: searchQuery,
    category: categoryQuery,
    minPrice,
    maxPrice,
    sort,
  });

  // Safely extract the products array from the API response
  // Adjust this fallback depending on if your backend returns an array directly, or an object like { success: true, products: [...] }
  const products = data?.products || data || [];

  // 4. HANDLERS
  const handleSearchChange = (newValue) => {
    const params = new URLSearchParams(searchParams);
    if (newValue) {
      params.set("q", newValue);
    } else {
      params.delete("q");
    }
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  // 5. DYNAMIC TITLES & STATES
  const pageTitle = categoryQuery
    ? `${categoryQuery} Collection`
    : "The Permanent Collection";

  // Prevent layout jumps by knowing exactly when we are loading or refetching
  const showLoadingState = isLoading || isFetching;

  return (
    <div className="w-full bg-ivory min-h-screen pt-28 pb-32 relative z-10 pointer-events-auto">
      {/* --- HEADER --- */}
      <header className="pb-12 px-6 md:px-12 max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center space-x-2 text-[10px] font-bold tracking-widest uppercase text-stone mb-8">
            <span
              className="hover:text-charcoal cursor-pointer transition-colors"
              onClick={handleClearFilters}
            >
              Home
            </span>
            <span>/</span>
            <span className="text-charcoal capitalize">
              {categoryQuery ? categoryQuery : "The Collection"}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal mb-4 capitalize">
                {pageTitle}
              </h1>
              <p className="text-stone text-sm md:text-base leading-relaxed">
                An evolving archive of architectural hardware, industrial
                lighting, and bespoke objects. Sourced globally for the
                meticulous curator.
              </p>
            </div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-stone hidden md:block">
              {/* Only show count when not loading to prevent layout jump */}
              {!showLoadingState && `Showing ${products.length} Curations`}
            </div>
          </div>
        </motion.div>
      </header>

      {/* --- TOOLBAR --- */}
      <ShopToolbar
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        onOpenFilters={() => setIsFilterOpen(true)}
      />

      {/* --- PRODUCT GRID AREA --- */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 min-h-[400px]">
        {/* Loading State Overlay */}
        {showLoadingState ? (
          <div className="w-full py-32 flex justify-center items-center">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone animate-pulse">
              Curating Archive...
            </p>
          </div>
        ) : (
          <ProductGrid
            products={products}
            onClearFilters={handleClearFilters}
          />
        )}

        {/* The Exact Empty State from your Screenshot */}
        {!showLoadingState && products.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-full border border-stone-200 flex items-center justify-center mb-6 text-stone-400">
              <Search strokeWidth={1} className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-3xl text-charcoal mb-4">
              No curations match your criteria.
            </h2>
            <p className="text-stone text-sm max-w-md">
              Consider expanding your search parameters or clearing your
              filters.
            </p>
          </motion.div>
        )}
      </div>

      {/* --- FILTER DRAWER --- */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
}
