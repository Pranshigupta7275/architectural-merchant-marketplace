export default function BrandShowcase() {
  const brands = [
    "Knoll",
    "Herman Miller",
    "Artemide",
    "Flos",
    "Cassina",
    "Vitra",
  ];

  return (
    <section className="py-20 border-t border-b border-neutral-100 bg-neutral-50 overflow-hidden">
      <div className="max-w-360 mx-auto px-4">
        <p className="text-center text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-10">
          Curated Design Partners
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-60 grayscale">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-xl md:text-2xl font-serif tracking-tight text-neutral-900"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
