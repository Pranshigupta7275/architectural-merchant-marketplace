import { Link } from "react-router-dom";

export default function NewArrivals({ products, isLoading, isError }) {
  if (isError || (!isLoading && products.length === 0)) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-light text-neutral-900 tracking-tight mb-16">
          Just Curated
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 lg:gap-x-8">
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse flex flex-col items-center"
                  >
                    <div className="aspect-square bg-neutral-100 rounded-full w-4/5 mb-6"></div>
                    <div className="h-4 bg-neutral-100 w-3/4 mb-2"></div>
                    <div className="h-3 bg-neutral-100 w-1/4"></div>
                  </div>
                ))
            : products.map((product) => (
                <Link
                  key={product._id || product.id}
                  to={`/shop/product/${product._id || product.id}`}
                  className="group text-center"
                >
                  <div className="aspect-square bg-neutral-50 rounded-full overflow-hidden mb-6 mx-auto w-4/5 relative">
                    <img
                      src={
                        product.images?.[0] ||
                        "https://via.placeholder.com/400x400"
                      }
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-[13px] font-medium text-neutral-900 truncate px-2">
                    {product.name}
                  </h3>
                  <p className="text-[12px] text-neutral-500 mt-1">
                    ${product.price?.toLocaleString() || "POA"}
                  </p>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
