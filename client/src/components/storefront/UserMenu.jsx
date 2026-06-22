import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Package, Heart, Settings, LogOut } from "lucide-react";

// --- TEMPORARY MOCK AUTH STATE FOR UI TESTING ---
// Change this to `true` to see the logged-in user menu!
const IS_AUTHENTICATED = false;
const MOCK_USER = {
  name: "Elena Rostova",
  email: "elena@rostovadesign.com",
};

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Handle clicking outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // TODO: Phase 4 - Dispatch logout action
    console.log("Logging out...");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 transition-colors rounded-full hover:bg-gray-50 hover:text-[#111827]"
        aria-label="User Menu"
      >
        <User className="w-5 h-5" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 w-64 mt-2 bg-white border border-gray-100 shadow-2xl z-50 py-2"
          >
            {IS_AUTHENTICATED ? (
              /* --- LOGGED IN STATE --- */
              <>
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                  <p className="text-[13px] font-bold text-[#111827] truncate">
                    {MOCK_USER.name}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">
                    {MOCK_USER.email}
                  </p>
                </div>

                <div className="py-2">
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-5 py-2.5 text-[13px] font-medium text-gray-600 transition-colors hover:text-[#111827] hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4 mr-3 text-gray-400" />
                    Account Settings
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-5 py-2.5 text-[13px] font-medium text-gray-600 transition-colors hover:text-[#111827] hover:bg-gray-50"
                  >
                    <Package className="w-4 h-4 mr-3 text-gray-400" />
                    Order History
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-5 py-2.5 text-[13px] font-medium text-gray-600 transition-colors hover:text-[#111827] hover:bg-gray-50"
                  >
                    <Heart className="w-4 h-4 mr-3 text-gray-400" />
                    Saved Pieces
                  </Link>
                </div>

                <div className="py-2 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-5 py-2.5 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              /* --- GUEST STATE --- */
              <div className="px-5 py-6 text-center">
                <h3 className="mb-2 text-[14px] font-bold text-[#111827]">
                  Curator Access
                </h3>
                <p className="mb-6 text-[12px] text-gray-500 leading-relaxed">
                  Sign in to manage your architectural collection and track your
                  acquisitions.
                </p>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-2.5 mb-3 text-[12px] font-bold tracking-widest text-white uppercase transition-colors bg-[#111827] hover:bg-gray-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-2.5 text-[12px] font-bold tracking-widest text-[#111827] uppercase transition-colors bg-white border border-[#111827] hover:bg-gray-50"
                >
                  Create Account
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
