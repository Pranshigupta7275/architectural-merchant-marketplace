import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function TrendingProducts({ products, isLoading, isError }) {
  if (isError) return null; // Fail silently to preserve page aesthetic

  return (
    <section className="py-24 bg-neutral-50 border-t border-neutral-200">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-2xl font-light text-neutral-900 tracking-tight">
              Trending Now
            </h2>
            <p className="text-[13px] text-neutral-500 mt-2 uppercase tracking-widest">
              Most desired curations
            </p>
          </div>
          <Link
            to="/shop/category/trending"
            className="hidden sm:flex items-center text-[13px] font-bold uppercase tracking-widest text-neutral-900 hover:text-neutral-500 transition-colors"
          >
            View All <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        {/* Mobile: Horizontal scroll. Desktop: Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-4 gap-6 pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="min-w-70 md:min-w-0 snap-start animate-pulse"
                  >
                    <div className="aspect-3/4 bg-neutral-200 mb-4 w-full"></div>
                    <div className="h-4 bg-neutral-200 w-3/4 mb-2"></div>
                    <div className="h-3 bg-neutral-200 w-1/4"></div>
                  </div>
                ))
            : products.map((product) => (
                <Link
                  key={product._id || product.id}
                  to={`/shop/product/${product._id || product.id}`}
                  className="min-w-70 md:min-w-0 snap-start group cursor-pointer"
                >
                  <div className="aspect-3/4 bg-neutral-200 mb-4 overflow-hidden relative">
                    <img
                      src={
                        product.images?.[0] ||
                        "https://via.placeholder.com/400x533"
                      }
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-[14px] font-medium text-neutral-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-[13px] text-neutral-500 mt-1">
                    ${product.price?.toLocaleString() || "POA"}
                  </p>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
