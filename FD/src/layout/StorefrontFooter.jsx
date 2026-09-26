import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function StorefrontFooter() {
  return (
    <footer className="bg-charcoal text-ivory pt-24 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-ivory/10 pb-16">
          {/* Brand Story */}
          <div className="col-span-1 md:col-span-5 pr-0 md:pr-12">
            <h3 className="font-sans font-bold tracking-[0.15em] text-xs uppercase mb-2">
              The Architectural Curator
            </h3>
            <p className="font-serif italic text-stone-light text-sm mb-6">
              A curated marketplace for architectural assets.
            </p>
            <p className="text-stone-light text-sm leading-relaxed mb-8">
              We source premium industrial designer objects, fine art prints,
              and bespoke furnishings for the discerning creator. Elevate your
              spaces with absolute precision.
            </p>
          </div>

          {/* Links */}
          <div className="col-span-1 md:col-span-3">
            <h4 className="font-sans font-bold tracking-widest text-[10px] uppercase text-stone-light mb-6">
              Explore
            </h4>
            <ul className="space-y-4">
              {[
                "New Acquisitions",
                "Architectural Assets",
                "Fine Art",
                "The Journal",
              ].map((link) => (
                <li key={link}>
                  <Link
                    to="/shop"
                    className="text-sm text-ivory/80 hover:text-brass transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1 md:col-span-4">
            <h4 className="font-sans font-bold tracking-widest text-[10px] uppercase text-stone-light mb-6">
              Join the Collection
            </h4>
            <p className="text-stone-light text-sm mb-4">
              Subscribe for exclusive access to new acquisitions and editorial
              content.
            </p>
            <form className="relative group">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-transparent border-b border-stone/30 py-3 pl-0 pr-10 text-sm text-ivory placeholder-stone focus:outline-none focus:border-brass transition-colors"
              />
              <button
                type="button"
                className="absolute right-0 top-3 text-stone group-hover:text-brass transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 text-[11px] text-stone-light tracking-wide">
          <p>
            © {new Date().getFullYear()} THE ARCHITECTURAL CURATOR. ALL RIGHTS
            RESERVED.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-ivory transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-ivory transition-colors">
              Terms of Service
            </Link>
            <span className="hover:text-ivory cursor-pointer transition-colors ml-4">
              USD ($)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
