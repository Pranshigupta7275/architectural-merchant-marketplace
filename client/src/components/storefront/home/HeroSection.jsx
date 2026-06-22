import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative h-[85vh] w-full bg-neutral-900 overflow-hidden flex items-center justify-center">
      {/* Background Image Placeholder */}
      <div 
        className="absolute inset-0 z-0 opacity-60 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')" }}
      />
      
      <div className="relative z-10 max-w-360 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/80 mb-6"
        >
          The Spring Collection
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight mb-8 max-w-4xl leading-tight"
        >
          Masterpieces of Modern Architecture.
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <Link 
            to="/shop/category/assets" 
            className="inline-flex items-center justify-center bg-white text-neutral-950 px-10 py-4 text-[13px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
          >
            Explore the Curation
          </Link>
        </motion.div>
      </div>
    </section>
  );
}