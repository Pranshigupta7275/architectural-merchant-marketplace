import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, Menu } from "lucide-react";
import { useSelector } from "react-redux";

import ProfileMenu from "../organisms/ProfileMenu";

export default function StorefrontNavbar({ onOpenCart, onOpenMenu }) {
  const [isScrolled, setIsScrolled] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState("");
  const navigate = useNavigate();

  // ✅ FIX: Safely pull the pre-calculated totalQuantity from your slice
  const { totalQuantity } = useSelector((state) => state.cart);
  const cartQuantity = totalQuantity || 0;

  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const wishlistCount = wishlistItems.length || 0;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(navSearchQuery.trim())}`);
      setIsSearchOpen(false);
      setNavSearchQuery("");
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-100 pointer-events-auto transition-colors duration-300 ${
        isScrolled
          ? "bg-ivory/85 backdrop-blur-md border-b border-stone/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex flex-col group">
          <span className="font-sans font-bold tracking-[0.15em] text-charcoal text-xs uppercase">
            The Architectural
          </span>
          <span className="font-serif italic text-stone text-[11px] group-hover:text-brass transition-colors">
            Curator
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-10">
          {["Assets", "Fine Art", "Industrial", "Brands"].map((item) => (
            <Link
              key={item}
              to={`/shop?category=${item.toLowerCase()}`}
              className="text-[11px] font-semibold tracking-widest uppercase text-charcoal/80 hover:text-brass transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-brass transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center relative">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0, paddingRight: 0 }}
                  animate={{ width: "220px", opacity: 1, paddingRight: "16px" }}
                  exit={{ width: 0, opacity: 0, paddingRight: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  onSubmit={handleSearchSubmit}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <input
                    type="text"
                    autoFocus
                    value={navSearchQuery}
                    onChange={(e) => setNavSearchQuery(e.target.value)}
                    placeholder="SEARCH ARCHIVE..."
                    className="w-full bg-transparent border-b border-charcoal/30 pb-1 text-[10px] font-bold tracking-widest uppercase text-charcoal focus:outline-none focus:border-charcoal placeholder:text-stone-400"
                  />
                </motion.form>
              )}
            </AnimatePresence>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-stone hover:text-charcoal transition-colors cursor-pointer"
              aria-label="Toggle Search"
            >
              <Search strokeWidth={1.5} className="w-5 h-5" />
            </button>
          </div>

          <div className="hidden md:block">
            <ProfileMenu />
          </div>

          <Link
            to="/wishlist"
            className="relative text-stone hover:text-charcoal transition-colors hidden md:block cursor-pointer"
            aria-label="Wishlist"
          >
            <Heart strokeWidth={1.5} className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brass text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            onClick={onOpenCart}
            className="relative text-charcoal hover:text-brass transition-colors cursor-pointer"
            aria-label="Cart"
          >
            <ShoppingBag strokeWidth={1.5} className="w-5 h-5" />
            {/* ✅ This now accurately reflects the totalQuantity from Redux */}
            <span className="absolute -top-1.5 -right-2 bg-charcoal text-ivory text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {cartQuantity}
            </span>
          </button>

          <button
            onClick={onOpenMenu}
            className="md:hidden text-charcoal cursor-pointer"
            aria-label="Mobile Menu"
          >
            <Menu strokeWidth={1.5} className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
