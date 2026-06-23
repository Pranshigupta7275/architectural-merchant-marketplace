import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Search, AlertCircle } from "lucide-react"; // Added AlertCircle for error UI

// 1. IMPORT YOUR RTK QUERY HOOK
import { useGetProductsQuery } from "../features/api/customerApi";

// --- COMPONENTS ---
import FilterDrawer from "./storefront/FilterDrawer";
import ProductGrid from "./storefront/ProductGrid";
import ShopToolbar from "../layout/ShopToolbar"; 

export default function Shop() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 2. EXTRACT URL PARAMETERS
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const categoryQuery = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "";

  // 3. FETCH REAL DATA FROM YOUR BACKEND (Added isError for safety)
  const { data, isLoading, isFetching, isError } = useGetProductsQuery({
    search: searchQuery,
    category: categoryQuery,
    minPrice,
    maxPrice,
    sort,
  });

  // Safely extract the products array
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
            {/* Accessibility Fix: Changed span to button for keyboard navigation */}
            <button
              type="button"
              className="hover:text-charcoal cursor-pointer transition-colors uppercase"
              onClick={handleClearFilters}
            >
              Home
            </button>
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
              {/* Only show count when strictly loaded and no errors */}
              {!showLoadingState && !isError && `Showing ${products.length} Curations`}
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

      {/* --- PRODUCT GRID AREA (Fixed Conditional Rendering) --- */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 min-h-100">
        {showLoadingState ? (
            
          /* STATE 1: LOADING */
          <div className="w-full py-32 flex justify-center items-center">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone animate-pulse">
              Curating Archive...
            </p>
          </div>

        ) : isError ? (
            
          /* STATE 2: BACKEND ERROR / OFFLINE */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" strokeWidth={1} />
            <h2 className="font-serif text-3xl text-charcoal mb-4">
              Connection Interrupted
            </h2>
            <p className="text-stone text-sm max-w-md">
              We are unable to load the archive right now. Please try refreshing the page.
            </p>
          </motion.div>

        ) : products.length === 0 ? (
            
          /* STATE 3: EMPTY STATE (No curations match) */
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
              Consider expanding your search parameters or clearing your filters.
            </p>
          </motion.div>

        ) : (
            
          /* STATE 4: DATA LOADED SUCCESSFULLY */
          <ProductGrid
            products={products}
            onClearFilters={handleClearFilters}
          />

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