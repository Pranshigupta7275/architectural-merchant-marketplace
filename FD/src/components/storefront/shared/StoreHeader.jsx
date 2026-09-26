import { Link } from "react-router-dom";
import { ShoppingBag, Heart, User, Menu } from "lucide-react";
import SearchBar from "./SearchBar";

export default function StoreHeader({ openCart, openMenu }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200 transition-all duration-300">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Mobile Menu Trigger */}
        <div className="flex-1 lg:hidden">
          <button
            onClick={openMenu}
            className="p-2 -ml-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Brand / Logo */}
        <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
          <Link
            to="/shop"
            className="flex flex-col items-center lg:items-start group"
          >
            <span className="text-[15px] font-bold tracking-wide uppercase text-neutral-900 group-hover:opacity-70 transition-opacity">
              The Architectural
            </span>
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-neutral-500">
              Curator
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-1 justify-center space-x-8">
          {["Assets", "Fine Art", "Industrial", "Brands"].map((item) => (
            <Link
              key={item}
              to={`/shop/category/${item.toLowerCase().replace(" ", "-")}`}
              className="text-[13px] font-medium text-neutral-600 hover:text-neutral-900 uppercase tracking-wider transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Actions (Search, Wishlist, Account, Cart) */}
        <div className="flex-1 flex justify-end items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:block">
            <SearchBar />
          </div>

          <Link
            to="/shop/account"
            className="hidden sm:block p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <User className="w-5 h-5 stroke-[1.5]" />
          </Link>

          <Link
            to="/shop/wishlist"
            className="hidden sm:block p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <Heart className="w-5 h-5 stroke-[1.5]" />
          </Link>

          <button
            onClick={openCart}
            className="p-2 -mr-2 sm:mr-0 text-neutral-600 hover:text-neutral-900 transition-colors relative flex items-center"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {/* Hardcoded badge for layout visualization; will connect to Redux later */}
            <span className="absolute top-1.5 right-1 bg-neutral-900 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              2
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
