import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CategoryCard({ category }) {
  // Safely extract data with fallbacks
  const {
    title = "Collection",
    slug = "collection",
    image = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
    itemCount = null,
  } = category || {};

  return (
    <Link
      to={`/shop?category=${slug}`}
      className="relative flex items-center justify-center w-full overflow-hidden cursor-pointer group aspect-square sm:aspect-4/5 bg-gray-100"
    >
      {/* Background Image with Hover Scale */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 object-cover w-full h-full transition-transform duration-1000 ease-in-out group-hover:scale-105"
      />

      {/* Gradient Overlay - Darkens slightly on hover for text readability */}
      <div className="absolute inset-0 transition-opacity duration-500 bg-black/20 group-hover:bg-black/40" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center p-6 transition-transform duration-500 transform translate-y-4 group-hover:translate-y-0">
        {/* Category Title */}
        <h3 className="text-2xl font-bold tracking-widest text-white uppercase sm:text-3xl drop-shadow-md">
          {title}
        </h3>

        {/* Optional Item Count */}
        {itemCount !== null && (
          <span className="mt-2 text-[11px] font-medium tracking-[0.2em] text-white/80 uppercase">
            {itemCount} Pieces
          </span>
        )}

        {/* Animated "Shop Now" Action */}
        <div className="flex items-center mt-6 text-[12px] font-bold tracking-widest text-white uppercase transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <span className="mr-2 border-b border-white/50 pb-0.5">Explore</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
