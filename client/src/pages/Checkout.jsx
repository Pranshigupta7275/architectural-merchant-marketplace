import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Checkout() {
  const { totalAmount, items } = useSelector((state) => state.cart);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full bg-ivory min-h-screen pt-32 pb-32"
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h1 className="font-serif text-4xl text-charcoal mb-4">
          Secure Checkout
        </h1>

        {items.length === 0 ? (
          <div className="py-12">
            <p className="text-stone text-sm mb-6">
              Your curation is currently empty.
            </p>
            <Link
              to="/shop"
              className="text-[11px] font-bold tracking-widest uppercase text-charcoal border-b border-charcoal pb-1 hover:text-brass hover:border-brass transition-colors"
            >
              Return to Archive
            </Link>
          </div>
        ) : (
          <div className="py-12">
            <p className="text-stone text-sm mb-8">
              You are securing {items.length} artifacts.
            </p>
            <div className="text-3xl font-serif text-charcoal mb-12">
              Total: $
              {(totalAmount || 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>

            {/* Future Stripe/Payment form will go here */}
            <div className="p-8 border border-stone-200 bg-white/50 text-left">
              <p className="text-[10px] font-bold tracking-widest uppercase text-stone mb-4">
                Payment Gateway Integration Pending
              </p>
              <div className="h-32 flex items-center justify-center border border-dashed border-stone-300">
                <span className="text-stone-400 text-sm">
                  Stripe / Order Form Container
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
