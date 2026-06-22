import { Link } from "react-router-dom";

export default function FeaturedCollections() {
  return (
    <section className="py-24 max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        <div className="w-full flex flex-col justify-center max-w-lg">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 mb-6">
            Editorial
          </span>
          <h2 className="text-3xl lg:text-5xl font-light text-neutral-900 leading-tight mb-6">
            The Brutalist Perspective.
          </h2>
          <p className="text-[15px] text-neutral-600 leading-relaxed mb-10">
            Discover a rigorous selection of raw concrete textures, exposed
            steel joints, and monolithic forms. Engineered for the modern
            purist.
          </p>
          <div>
            <Link
              to="/shop/collection/brutalist"
              className="border-b border-neutral-900 pb-1 text-[12px] font-bold uppercase tracking-widest text-neutral-900 hover:text-neutral-500 hover:border-neutral-500 transition-all"
            >
              Explore Collection
            </Link>
          </div>
        </div>
        <div className="w-full aspect-4/5 lg:aspect-square bg-neutral-100 relative">
          <img
            src="https://images.unsplash.com/photo-1518384401463-d38761b3fee7?q=80&w=1974&auto=format&fit=crop"
            alt="Brutalist Architecture"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
