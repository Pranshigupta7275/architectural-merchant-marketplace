import { Link } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";

export default function ProductCard({ product }) {
  // 1. EXACT MONGODB MAPPING
  const {
    _id = "demo-id",
    title = "Architectural Piece", // Maps the backend 'title' instead of 'name'
    price = 0,
    category = "Collection",
    images = [],
    inventory = {}, // Maps the backend inventory object
  } = product || {};

  // 2. FIX THE IMAGE: Extract the '.url' string from the image object array
  const displayImage =
    images?.[0]?.url ||
    "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?auto=format&fit=crop&w=800&q=80";

  // 3. FIX THE INVENTORY: Extract the actual stock quantity number
  const stockQuantity = inventory?.stockQuantity || 0;

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault(); 
    // TODO: Phase 3 - Dispatch addToCart(product)
    console.log(`Added ${title} to cart`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    // TODO: Phase 3 - Dispatch toggleWishlist(product)
    console.log(`Toggled wishlist for ${title}`);
  };

  return (
    <div className="relative flex flex-col group">
      {/* Image Container */}
      <Link
        to={`/product/${_id}`}
        className="relative aspect-4/5 w-full overflow-hidden bg-gray-50 mb-4 cursor-pointer"
      >
        <img
          src={displayImage}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Status Badge */}
        {stockQuantity <= 0 && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#111827]">
            Sold Out
          </div>
        )}

        {/* Hover Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 flex gap-2 p-4 transition-all duration-300 ease-out translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
          <button
            onClick={handleQuickAdd}
            disabled={stockQuantity <= 0}
            className="flex items-center justify-center flex-1 gap-2 px-4 py-3 text-[11px] font-bold tracking-wider text-[#111827] uppercase transition-colors bg-white/90 backdrop-blur-md hover:bg-[#111827] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-4 h-4" />
            Quick Add
          </button>

          <button
            onClick={handleWishlist}
            className="flex items-center justify-center transition-colors bg-white/90 backdrop-blur-md text-[#111827] w-11 h-11 hover:bg-[#111827] hover:text-white"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </Link>

      {/* Product Typography & Info */}
      <Link
        to={`/product/${_id}`}
        className="flex flex-col flex-1 cursor-pointer"
      >
        <span className="mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
          {category}
        </span>

        <h3 className="mb-2 text-[14px] font-medium leading-snug text-[#111827] transition-colors group-hover:text-gray-500">
          {title}
        </h3>

        <span className="mt-auto text-[13px] tracking-wide text-gray-600">
          {formatPrice(price)}
        </span>
      </Link>
    </div>
  );
}
