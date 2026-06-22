import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";

// Import the NEW luxury components we just created
import StorefrontNavbar from "./StorefrontNavbar";
import StorefrontFooter from "./StorefrontFooter";

import CartDrawer from "../components/storefront/CartDrawer";

export default function StorefrontLayout() {
  const { pathname } = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Framer Motion scroll progress indicator logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Scroll to top on route change & close menus
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-ivory relative">
      {/* Scroll Progress Bar 
        ✅ FIX: Increased to z-[150] so it safely sits ABOVE the z-100 Navbar 
      */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-brass origin-left z-[150] pointer-events-none"
        style={{ scaleX }}
      />

      {/* --- GLOBAL DRAWERS --- */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* --- NEW LUXURY HEADER --- */}
      <StorefrontNavbar
        isMobileMenuOpen={isMobileMenuOpen}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* --- DYNAMIC MAIN CONTENT WITH PAGE TRANSITIONS --- 
        ✅ FIX: Wrapped in AnimatePresence so the exit animations actually fire when routes change
      */}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={{
            initial: { opacity: 0, y: 15 },
            animate: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
            },
            exit: {
              opacity: 0,
              y: -15,
              transition: { duration: 0.3 },
            },
          }}
          className="flex flex-col grow w-full relative overflow-x-hidden pt-20"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      {/* --- NEW LUXURY FOOTER --- */}
      <StorefrontFooter />
    </div>
  );
}
