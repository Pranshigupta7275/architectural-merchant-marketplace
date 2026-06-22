import { Globe, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 pt-12 pb-8 border-t border-gray-200 text-brand-dark">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        
        {/* Brand Column */}
        <div className="md:col-span-2 pr-12">
          <h3 className="text-base font-bold mb-3">The Architectural Merchant</h3>
          <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
            A curated marketplace for architectural assets, fine art prints, and industrial designer objects. Empowering the modern curator through precision data.
          </p>
        </div>

        {/* Governance Links */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-dark mb-4 text-blue-900">Governance</h4>
          <ul className="space-y-3 text-xs text-gray-500">
            <li><a href="#" className="hover:text-brand-dark transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-brand-dark transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        {/* Operations Links */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-dark mb-4 text-blue-900">Operations</h4>
          <ul className="space-y-3 text-xs text-gray-500">
            <li><a href="#" className="hover:text-brand-dark transition-colors">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-brand-dark transition-colors">Contact Us</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Icons */}
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center pt-6 text-xs text-gray-400">
        <div className="flex items-center space-x-4 order-2 sm:order-1 mt-4 sm:mt-0">
          <Globe className="w-4 h-4 hover:text-brand-dark cursor-pointer transition-colors" />
          <Share2 className="w-4 h-4 hover:text-brand-dark cursor-pointer transition-colors" />
        </div>
        <p className="order-1 sm:order-2 text-right uppercase tracking-wider text-[9px]">
          &copy; 2024 THE ARCHITECTURAL MERCHANT. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}