import { useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar({
  onSearch,
  placeholder = "Search curated collections...",
  className = "",
}) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    if (onSearch) {
      onSearch(""); // Trigger a search with an empty string to reset results
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full max-w-2xl group ${className}`}
    >
      {/* Search Icon */}
      <div className="absolute left-0 flex items-center justify-center pl-4 pointer-events-none">
        <Search
          className={`w-5 h-5 transition-colors duration-300 ${
            isFocused ? "text-[#111827]" : "text-gray-400"
          }`}
        />
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full py-4 pl-12 pr-12 text-[14px] text-[#111827] transition-all duration-300 bg-gray-50 border-b-2 border-transparent outline-none focus:bg-white focus:border-[#111827] placeholder:text-gray-400 placeholder:tracking-wide"
      />

      {/* Clear Button (Animates in when there is text) */}
      <AnimatePresence>
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            type="button"
            onClick={handleClear}
            className="absolute right-0 flex items-center justify-center pr-4 text-gray-400 hover:text-[#111827] transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Elegant Bottom Line Animation */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-[#111827]"
        initial={{ width: "0%" }}
        animate={{ width: isFocused ? "100%" : "0%" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </form>
  );
}
