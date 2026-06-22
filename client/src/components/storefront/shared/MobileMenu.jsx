import { motion } from "framer-motion";
import { X, Search, Heart, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function MobileMenu({ closeMenu }) {
  const navLinks = [
    "Architectural Assets",
    "Fine Art Prints",
    "Industrial Objects",
    "Brands",
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeMenu}
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 lg:hidden"
      />

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 h-full w-full max-w-[85%] sm:max-w-sm bg-white z-50 shadow-2xl flex flex-col lg:hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-900">
            Menu
          </span>
          <button
            onClick={closeMenu}
            className="p-2 -mr-2 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="p-6 border-b border-neutral-100">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-neutral-400 stroke-[1.5]" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-neutral-50 border border-transparent focus:border-neutral-300 text-[14px] rounded-lg py-3 pl-11 pr-4 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Categories */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1 px-4">
            {navLinks.map((item) => (
              <li key={item}>
                <Link
                  to={`/shop/category/${item.toLowerCase().replace(/ /g, "-")}`}
                  onClick={closeMenu}
                  className="block px-4 py-3 text-[15px] font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 rounded-lg transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Actions */}
        <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex gap-4">
          <Link
            to="/shop/account"
            onClick={closeMenu}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-neutral-200 rounded-lg text-[13px] font-medium text-neutral-700 shadow-sm hover:border-neutral-300 transition-colors"
          >
            <User className="w-4 h-4" /> Account
          </Link>
          <Link
            to="/shop/wishlist"
            onClick={closeMenu}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-neutral-200 rounded-lg text-[13px] font-medium text-neutral-700 shadow-sm hover:border-neutral-300 transition-colors"
          >
            <Heart className="w-4 h-4" /> Wishlist
          </Link>
        </div>
      </motion.div>
    </>
  );
}
