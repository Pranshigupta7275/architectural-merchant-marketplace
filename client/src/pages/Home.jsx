import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  ShieldCheck,
  Truck,
  PackageCheck,
  Quote,
} from "lucide-react";

// ✅ 1. REDUX IMPORTS
import { useDispatch } from "react-redux";
import { addItemToCart } from "../features/cart/cartSlice";

export default function Home() {
  // ✅ 2. INITIALIZE DISPATCH
  const dispatch = useDispatch();

  // ✅ 3. THE BULLETPROOF QUICK ADD FUNCTION WITH ERROR LOGGING
  const handleProductAddToCart = (product) => {
    console.log("🔘 Quick Add Clicked for:", product.name);

    try {
      // Safely handle the price whether it's a string ("$125") or already a number (125)
      const numericPrice =
        typeof product.price === "string"
          ? parseFloat(product.price.replace("$", ""))
          : product.price;

      dispatch(
        addItemToCart({
          id: product.id || product._id, // Fallback safety match
          name: product.name,
          price: numericPrice,
          quantity: 1,
          images: [product.image],
        }),
      );
      console.log("✅ Successfully sent to Redux Cart!");
    } catch (error) {
      console.error("❌ Failed to add item to cart:", error);
    }
  };

  // --- Framer Motion Animation Variants ---
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const imageReveal = {
    hidden: { scale: 1.1, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // --- Mock Data ---
  const categories = [
    {
      id: 1,
      title: "Architectural Hardware",
      image:
        "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800",
      link: "/shop?category=hardware",
    },
    {
      id: 2,
      title: "Industrial Lighting",
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
      link: "/shop?category=lighting",
    },
    {
      id: 3,
      title: "Bespoke Furnishings",
      image:
        "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=800",
      link: "/shop?category=furnishings",
    },
  ];

  const featuredProducts = [
    {
      id: 101,
      name: "Matte Black Knurled Handle",
      category: "Hardware",
      price: "$125",
      image:
        "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 102,
      name: "Brass Articulating Sconce",
      category: "Lighting",
      price: "$450",
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 103,
      name: "Ebonized Oak Stool",
      category: "Furnishings",
      price: "$890",
      image:
        "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 104,
      name: "Travertine Centerpiece",
      category: "Objects",
      price: "$320",
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600",
    },
  ];

  const values = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Authenticity Guaranteed",
      desc: "Every piece is vetted by our architectural design board.",
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "White Glove Delivery",
      desc: "Premium logistics for delicate industrial and art pieces.",
    },
    {
      icon: <PackageCheck className="w-6 h-6" />,
      title: "Bespoke Packaging",
      desc: "Unboxing experiences designed for the discerning.",
    },
  ];

  const testimonials = [
    {
      text: "The curation is unparalleled. I sourced the lighting for our entire Milan exhibition through the Curator.",
      author: "Elena R., Principal Architect",
    },
    {
      text: "A digital sanctuary for minimalist design. The hardware quality exceeded my highest expectations.",
      author: "Marcus V., Industrial Designer",
    },
  ];

  return (
    <div className="w-full bg-ivory">
      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
        <motion.div
          variants={imageReveal}
          initial="hidden"
          animate="show"
          className="absolute inset-0 w-full h-full"
        >
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000"
            alt="Minimalist Architecture"
            className="object-cover w-full h-full object-center"
          />
          <div className="absolute inset-0 bg-linear-to-b from-charcoal/50 via-charcoal/20 to-ivory" />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="relative z-10 text-center px-6 max-w-4xl mt-16"
        >
          <motion.h2
            variants={fadeUp}
            className="font-sans font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase text-brass mb-6"
          >
            The Permanent Collection
          </motion.h2>
          <motion.h1
            variants={fadeUp}
            className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight"
          >
            Curated Architectural <br className="hidden md:block" /> Essentials.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="font-sans text-white/90 text-sm md:text-base max-w-xl mx-auto mb-10 font-light leading-relaxed"
          >
            Elevate your spaces with our meticulously selected hardware,
            lighting, and bespoke industrial objects.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center gap-6"
          >
            <Link
              to="/shop"
              className="inline-flex items-center justify-center bg-white text-charcoal px-8 py-4 text-[11px] font-bold tracking-widest uppercase hover:bg-brass hover:text-white transition-all duration-300 shadow-xl"
            >
              Explore Collection <ArrowRight className="ml-3 w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. CURATED CATEGORIES */}
      <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-xl">
            <h2 className="font-sans font-bold tracking-widest text-[11px] uppercase text-stone mb-3">
              Discover
            </h2>
            <h3 className="font-serif text-3xl md:text-4xl text-charcoal">
              Design Disciplines
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                delay: i * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group cursor-pointer"
            >
              <Link
                to={category.link}
                className="block overflow-hidden relative aspect-4/5 bg-stone/10"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-linear-to-t from-charcoal/70 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <h4 className="font-sans font-bold tracking-widest text-[12px] uppercase text-white mb-2">
                    {category.title}
                  </h4>
                  <div className="flex items-center text-brass opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                    <span className="text-[10px] tracking-wider uppercase font-bold mr-2">
                      Explore
                    </span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto border-t border-stone/20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-sans font-bold tracking-widest text-[11px] uppercase text-stone mb-3">
              Acquisitions
            </h2>
            <h3 className="font-serif text-3xl md:text-4xl text-charcoal">
              Recent Additions
            </h3>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex items-center text-[11px] font-bold tracking-widest uppercase text-charcoal hover:text-brass transition-colors"
          >
            View Archive <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {featuredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group"
            >
              <div className="relative aspect-square mb-6 overflow-hidden bg-stone/5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                />

                {/* ✅ MULTI-LAYER RESOLUTION OVERLAY PATCH */}
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex justify-center z-50 pointer-events-none">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleProductAddToCart(product);
                    }}
                    className="w-full bg-white/95 backdrop-blur-sm text-charcoal py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-charcoal hover:text-white transition-colors shadow-lg cursor-pointer pointer-events-auto relative z-50"
                  >
                    Quick Add
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-stone font-bold tracking-widest uppercase mb-1">
                    {product.category}
                  </p>
                  <h4 className="text-sm font-medium text-charcoal">
                    {product.name}
                  </h4>
                </div>
                <p className="text-sm text-charcoal font-medium">
                  {product.price}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED COLLECTION BANNER */}
      <section className="my-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-[50vh] lg:h-[70vh] relative overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=1200"
              alt="The Minimalist Edit"
              className="object-cover w-full h-full"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-charcoal flex items-center justify-center p-12 lg:p-24 text-center lg:text-left h-[50vh] lg:h-[70vh]"
          >
            <div className="max-w-md">
              <h4 className="font-sans font-bold tracking-[0.2em] text-[10px] uppercase text-brass mb-4">
                The Brutalist Edit
              </h4>
              <h2 className="font-serif text-4xl lg:text-5xl text-ivory mb-6">
                Raw Materials. Absolute Precision.
              </h2>
              <p className="text-stone-light text-sm leading-relaxed mb-8">
                A curated selection of cold-rolled steel, poured concrete, and
                untreated brass. Designed to age, patina, and tell a story
                within your space.
              </p>
              <Link
                to="/shop?collection=brutalist"
                className="inline-flex items-center text-[11px] font-bold tracking-widest uppercase text-ivory hover:text-brass transition-colors border-b border-brass/30 pb-1 hover:border-brass"
              >
                Shop The Edit
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US (VALUES) */}
      <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto bg-white/50 border-y border-stone/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {values.map((val, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="flex flex-col items-center md:items-start"
            >
              <div className="text-brass mb-6 bg-ivory p-4 rounded-full shadow-sm">
                {val.icon}
              </div>
              <h4 className="font-serif text-xl text-charcoal mb-3">
                {val.title}
              </h4>
              <p className="text-stone text-sm leading-relaxed max-w-sm">
                {val.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-32 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <Quote className="w-10 h-10 text-brass/40 mx-auto mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {testimonials.map((test, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.3, duration: 0.8 }}
            >
              <div className="flex justify-center mb-6 space-x-1">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-brass text-brass" />
                ))}
              </div>
              <p className="font-serif text-xl md:text-2xl text-charcoal leading-relaxed mb-6">
                "{test.text}"
              </p>
              <p className="font-sans font-bold tracking-widest text-[10px] uppercase text-stone">
                {test.author}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. PRE-FOOTER NEWSLETTER CTA */}
      <section className="relative py-32 px-6 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-charcoal">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541123356219-284ebe98ae3b?auto=format&fit=crop&q=80&w=2000')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-2xl text-center"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-ivory mb-6">
            Join the Inner Circle
          </h2>
          <p className="text-stone-light text-sm md:text-base mb-10">
            Sign up for early access to limited edition architectural objects
            and private curator notes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Your Email Address"
              className="bg-transparent border border-stone-light/50 text-ivory px-6 py-4 text-sm w-full sm:w-80 focus:outline-none focus:border-brass transition-colors"
            />
            <button className="bg-brass text-white px-8 py-4 text-[11px] font-bold tracking-widest uppercase hover:bg-white hover:text-charcoal transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
