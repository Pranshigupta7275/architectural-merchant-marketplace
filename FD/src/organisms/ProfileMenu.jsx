import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";

// Corrected relative path: stepped back one folder (../) from 'organisms' to 'src'
import {
  logout,
  selectCurrentUser,
  selectCurrentToken,
} from "../features/auth/authSlice";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Consuming your custom selectors
  const userInfo = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);

  // Determine auth state based on token existence
  const isAuthenticated = !!token;

  // Close dropdown when clicking outside
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
    dispatch(logout());
    setIsOpen(false);
    navigate("/");
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative hover:text-stone-500 transition-colors flex items-center p-2 -m-2 ${
          isAuthenticated ? "text-stone-900" : "text-stone-400"
        }`}
        aria-label="Account menu"
      >
        <User className="w-5 h-5" />
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-6 w-72 bg-white shadow-2xl border border-stone-100 z-50 flex flex-col"
          >
            {isAuthenticated ? (
              <>
                {/* User Greeting */}
                <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-stone-400 mb-1">
                    Welcome Back
                  </p>
                  <h3 className="text-sm font-medium text-stone-900 truncate">
                    {/* Fallbacks in case userInfo only has 'name' instead of first/last */}
                    {userInfo?.firstName
                      ? `${userInfo.firstName} ${userInfo.lastName}`
                      : userInfo?.name || "Guest"}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 truncate">
                    {userInfo?.email}
                  </p>
                </div>

                {/* Menu Links */}
                <div className="py-2">
                  <MenuLink
                    to="/account/orders"
                    icon={Package}
                    label="Order History"
                    setIsOpen={setIsOpen}
                  />
                  <MenuLink
                    to="/account/addresses"
                    icon={MapPin}
                    label="Saved Addresses"
                    setIsOpen={setIsOpen}
                  />
                  <MenuLink
                    to="/account/billing"
                    icon={CreditCard}
                    label="Payment Methods"
                    setIsOpen={setIsOpen}
                  />
                  <MenuLink
                    to="/account/settings"
                    icon={Settings}
                    label="Account Settings"
                    setIsOpen={setIsOpen}
                  />
                </div>

                {/* Logout Action */}
                <div className="p-4 border-t border-stone-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 text-[11px] font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </>
            ) : (
              /* Logged Out State */
              <div className="p-8 text-center">
                <User className="w-8 h-8 text-stone-300 mx-auto mb-4" />
                <h3 className="text-[14px] font-bold text-stone-900 mb-2">
                  Access Your Collection
                </h3>
                <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                  Sign in to view your orders, update your details, and curate
                  your wishlist.
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/login");
                  }}
                  className="w-full py-4 bg-stone-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Sign In / Register
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper component for cleaner link rendering
const MenuLink = ({ to, icon: Icon, label, setIsOpen }) => (
  <Link
    to={to}
    onClick={() => setIsOpen(false)}
    className="flex items-center gap-3 px-6 py-3 text-[13px] text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors group"
  >
    <Icon className="w-4 h-4 text-stone-400 group-hover:text-stone-900 transition-colors" />
    <span>{label}</span>
  </Link>
);
