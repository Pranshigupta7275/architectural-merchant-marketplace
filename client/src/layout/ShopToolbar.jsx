import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";

export default function ShopToolbar({
  searchQuery,
  setSearchQuery,
  onOpenFilters,
}) {
  return (
    <div className="sticky top-20 z-30 bg-ivory/90 backdrop-blur-md border-y border-stone/15 mb-12">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Interactive Search */}
        <div className="relative w-full sm:w-auto flex-1 max-w-sm group">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-stone group-focus-within:text-brass transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the archive..."
            className="w-full bg-transparent border-none py-2 pl-8 pr-4 text-sm text-charcoal placeholder-stone focus:outline-none focus:ring-0"
          />
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex items-center w-full sm:w-auto gap-6 justify-between sm:justify-end">
          <div className="hidden md:flex items-center cursor-pointer group">
            <span className="text-[11px] font-bold tracking-widest uppercase text-charcoal mr-2">
              Sort By
            </span>
            <ChevronDown className="w-4 h-4 text-stone group-hover:text-charcoal transition-colors" />
          </div>

          <button
            onClick={onOpenFilters}
            className="flex items-center text-[11px] font-bold tracking-widest uppercase text-charcoal hover:text-brass transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
      </div>
    </div>
  );
}
