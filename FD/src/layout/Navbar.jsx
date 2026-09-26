import "react"; // ✅ FIX 1: Corrected React import
import { motion } from "framer-motion";
import { Search, Bell, ShoppingBag, Menu } from "lucide-react";
import HeaderProfile from "../components/HeaderProfile";
import { useSelector } from "react-redux";

export default function Navbar({ setMobileOpen }) {
  // ✅ FIX 2: Defensive Redux Selection.
  // We safely check for totalQuantity, and if it doesn't exist, we compute it from items.
  const cartState = useSelector((state) => state.cart || {});
  const cartQuantity =
    cartState.totalQuantity ??
    (cartState.items?.reduce((total, item) => total + item.quantity, 0) || 0);

  return (
    // ✅ FIX 3: Boosted to z-[100] and added pointer-events-auto to ensure it never gets blocked
    <header className="h-20 w-full bg-white flex items-center justify-between px-8 z-100 sticky top-0 border-b border-gray-100 pointer-events-auto">
      {/* Mobile Menu Toggle */}
      <button
        className="mr-4 lg:hidden text-[#111827] hover:text-gray-500 transition-colors cursor-pointer"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Left: Brand Title */}
      <div className="hidden lg:block w-1/4">
        <h2 className="text-[14px] font-bold text-[#111827] leading-[1.2] tracking-wider font-sans">
          THE <br /> ARCHITECTURAL <br /> MERCHANT
        </h2>
      </div>

      {/* Middle: Centered Search Bar */}
      <div className="flex-1 max-w-2xl mx-4 hidden md:block">
        <div className="relative flex items-center group">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 group-focus-within:text-[#111827] transition-colors" />
          <input
            type="text"
            placeholder="Search orders, products, or inventory"
            className="w-full bg-[#F3F4F6] border-none text-[13px] rounded-md pl-11 pr-4 py-2.5 text-[#111827] placeholder-gray-500 focus:ring-1 focus:ring-gray-200 focus:bg-white focus:outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Right: Interactive Text Links & Icons */}
      <div className="flex items-center justify-end space-x-8 w-auto lg:w-1/3">
        {/* Animated Text Navigation */}
        <nav className="hidden xl:flex items-center space-x-6 text-[11px] font-bold text-gray-500 tracking-wider">
          {["SHOP", "COLLECTIONS", "JOURNAL"].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              whileHover={{ y: -2, color: "#111827" }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer transition-colors block"
            >
              {item}
            </motion.a>
          ))}
        </nav>

        {/* Animated Icons & Profile */}
        <div className="flex items-center space-x-5 text-gray-600">
          <motion.button
            whileHover={{ scale: 1.1, color: "#111827" }}
            whileTap={{ scale: 0.9 }}
            className="transition-colors focus:outline-none cursor-pointer"
          >
            <Bell className="w-5 h-5 stroke-[1.5]" />
          </motion.button>

          {/* SHOPPING BAG WITH REDUX BADGE */}
          <motion.button
            whileHover={{ scale: 1.1, color: "#111827" }}
            whileTap={{ scale: 0.9 }}
            className="relative transition-colors focus:outline-none cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />

            {/* ✅ FIX 4: Only render the bubble if there is actually an item in the cart */}
            {cartQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#111827] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartQuantity}
              </span>
            )}
          </motion.button>

          {/* The newly integrated Smart Profile Component */}
          <HeaderProfile />
        </div>
      </div>
    </header>
  );
}
