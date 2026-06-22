import { Link } from "react-router-dom";

export default function StoreFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-neutral-400 pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-neutral-900">
      <div className="max-w-360 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="md:col-span-2 md:pr-12">
            <h3 className="text-white text-[15px] font-bold tracking-wide uppercase mb-4">
              The Architectural Curator
            </h3>
            <p className="text-[13px] leading-relaxed max-w-sm mb-6">
              A curated marketplace for architectural assets, fine art prints,
              and industrial designer objects. Designed for the discerning
              creator.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.15em] mb-5">
              Shop
            </h4>
            <ul className="space-y-3 text-[13px]">
              <li>
                <Link
                  to="/shop/category/assets"
                  className="hover:text-white transition-colors"
                >
                  Architectural Assets
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/category/art"
                  className="hover:text-white transition-colors"
                >
                  Fine Art Prints
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/category/industrial"
                  className="hover:text-white transition-colors"
                >
                  Industrial Objects
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.15em] mb-5">
              Support
            </h4>
            <ul className="space-y-3 text-[13px]">
              <li>
                <Link
                  to="/shop/shipping"
                  className="hover:text-white transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] uppercase tracking-wider">
            &copy; {currentYear} THE ARCHITECTURAL MERCHANT. ALL RIGHTS
            RESERVED.
          </p>
          <div className="flex gap-4 text-[12px]">
            <span>USD ($)</span>
            <span>EN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
