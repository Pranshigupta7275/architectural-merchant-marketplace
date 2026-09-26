import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function FilterDrawer({ isOpen, onClose }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Local state to hold selections before user clicks "Apply"
  const [localCategory, setLocalCategory] = useState("");
  const [localMinPrice, setLocalMinPrice] = useState("");
  const [localMaxPrice, setLocalMaxPrice] = useState("");

  // Sync the drawer's checkboxes with the URL whenever it opens
  useEffect(() => {
    if (isOpen) {
      setLocalCategory(searchParams.get("category") || "");
      setLocalMinPrice(searchParams.get("minPrice") || "");
      setLocalMaxPrice(searchParams.get("maxPrice") || "");
    }
  }, [isOpen, searchParams]);

  const filterCategories = [
    "Hardware",
    "Lighting",
    "Furnishings",
    "Fine Art",
    "Objects",
  ];

  // Map your beautiful labels to actual data values
  const priceRanges = [
    { label: "Under $100", min: "0", max: "100" },
    { label: "$100 - $500", min: "100", max: "500" },
    { label: "$500 - $1,000", min: "500", max: "1000" },
    { label: "Over $1,000", min: "1000", max: "" }, // Empty max means infinity
  ];

  // Handlers for checking/unchecking boxes
  const handleCategoryToggle = (cat) => {
    setLocalCategory((prev) => (prev === cat ? "" : cat));
  };

  const handlePriceToggle = (min, max) => {
    if (localMinPrice === min && localMaxPrice === max) {
      setLocalMinPrice("");
      setLocalMaxPrice("");
    } else {
      setLocalMinPrice(min);
      setLocalMaxPrice(max);
    }
  };

  // Push local state to URL on Apply
  const handleApply = () => {
    const params = new URLSearchParams(searchParams);

    if (localCategory) params.set("category", localCategory);
    else params.delete("category");

    if (localMinPrice) params.set("minPrice", localMinPrice);
    else params.delete("minPrice");

    if (localMaxPrice !== "") params.set("maxPrice", localMaxPrice);
    else params.delete("maxPrice");

    setSearchParams(params);
    onClose();
  };

  // Clear everything out
  const handleClear = () => {
    setLocalCategory("");
    setLocalMinPrice("");
    setLocalMaxPrice("");

    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("minPrice");
    params.delete("maxPrice");

    setSearchParams(params);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-100 bg-ivory shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone/10">
              <h2 className="font-sans font-bold tracking-widest text-[11px] uppercase text-charcoal">
                Filter Curations
              </h2>
              <button
                onClick={onClose}
                className="text-stone hover:text-charcoal transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-10">
              {/* Category Filter */}
              <div>
                <h3 className="font-serif text-lg text-charcoal mb-4">
                  Discipline
                </h3>
                <div className="space-y-3">
                  {filterCategories.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center group cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={
                          localCategory.toLowerCase() === cat.toLowerCase()
                        }
                        onChange={() => handleCategoryToggle(cat)}
                        className="appearance-none w-4 h-4 border border-stone/50 checked:bg-brass checked:border-transparent transition-colors cursor-pointer relative after:content-[''] after:absolute after:hidden checked:after:block after:left-1 after:top-px after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
                      />
                      <span className="ml-3 text-sm text-charcoal/80 group-hover:text-charcoal transition-colors">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="font-serif text-lg text-charcoal mb-4">
                  Investment
                </h3>
                <div className="space-y-3">
                  {priceRanges.map((range) => (
                    <label
                      key={range.label}
                      className="flex items-center group cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={
                          localMinPrice === range.min &&
                          localMaxPrice === range.max
                        }
                        onChange={() => handlePriceToggle(range.min, range.max)}
                        className="appearance-none w-4 h-4 border border-stone/50 checked:bg-brass checked:border-transparent transition-colors cursor-pointer relative after:content-[''] after:absolute after:hidden checked:after:block after:left-1 after:top-px after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
                      />
                      <span className="ml-3 text-sm text-charcoal/80 group-hover:text-charcoal transition-colors">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-stone/10 bg-white/50 flex gap-4">
              <button
                onClick={handleClear}
                className="flex-1 border border-charcoal text-charcoal py-4 text-[10px] font-bold tracking-widest uppercase hover:bg-stone/5 transition-colors cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={handleApply}
                className="flex-1 bg-charcoal text-white py-4 text-[10px] font-bold tracking-widest uppercase hover:bg-brass transition-colors cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
