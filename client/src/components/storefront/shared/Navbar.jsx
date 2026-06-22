import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import UserMenu from "./UserMenu";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { pathname } = useLocation();
  const cartQuantity = useSelector(
    (state) => state.cart?.cartTotalQuantity || 0,
  );

  // Handle transparent to solid background transition on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Shop", path: "/shop" },
    { name: "Collections", path: "/collections" },
    { name: "Journal", path: "/journal" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          isScrolled || pathname !== "/"
            ? "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="shrink-0 flex flex-col">
              <span
                className={`text-[15px] font-bold tracking-[0.2em] uppercase leading-tight ${isScrolled || pathname !== "/" ? "text-[#111827]" : "text-gray-900 md:text-white"}`}
              >
                The Architectural
              </span>
              <span
                className={`text-[15px] font-bold tracking-[0.2em] uppercase leading-tight ${isScrolled || pathname !== "/" ? "text-[#111827]" : "text-gray-900 md:text-white"}`}
              >
                Merchant
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-12">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[11px] font-bold tracking-widest uppercase transition-colors hover:opacity-50 ${
                    isScrolled || pathname !== "/"
                      ? "text-[#111827]"
                      : "text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Icons (User & Cart) */}
            <div className="hidden md:flex items-center space-x-6">
              <div
                className={
                  isScrolled || pathname !== "/"
                    ? "text-[#111827]"
                    : "text-white"
                }
              >
                <UserMenu />
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 transition-colors hover:opacity-50 ${
                  isScrolled || pathname !== "/"
                    ? "text-[#111827]"
                    : "text-white"
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartQuantity > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-red-600 rounded-full">
                    {cartQuantity}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 ${isScrolled || pathname !== "/" ? "text-[#111827]" : "text-gray-900"}`}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer Component */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-white pt-24 px-6 md:hidden">
          <div className="flex flex-col space-y-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-2xl font-bold tracking-widest text-[#111827] uppercase"
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-gray-100" />
            <Link
              to="/login"
              className="text-sm font-bold tracking-widest text-gray-500 uppercase"
            >
              Curator Sign In
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
