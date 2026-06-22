import { Link } from "react-router-dom";

const categories = [
  {
    name: "Architectural Elements",
    slug: "elements",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Fine Art Prints",
    slug: "art",
    img: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Industrial Lighting",
    slug: "lighting",
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop",
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-360 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/shop/category/${cat.slug}`}
            className="group relative aspect-4/5 overflow-hidden bg-neutral-100 flex items-center justify-center"
          >
            <img
              src={cat.img}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-neutral-900/20 group-hover:bg-neutral-900/40 transition-colors duration-500" />
            <h3 className="relative z-10 text-white text-lg lg:text-xl font-medium tracking-wide">
              {cat.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
