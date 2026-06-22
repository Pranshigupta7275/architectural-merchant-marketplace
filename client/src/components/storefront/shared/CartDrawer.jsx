import { motion } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";


export default function CartDrawer({ closeCart }) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeCart}
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-neutral-900">
            Your Cart (0)
          </h2>
          <button
            onClick={closeCart}
            className="p-2 -mr-2 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Empty State (Default for Foundation Phase) */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-6 h-6 text-neutral-300 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-medium text-neutral-900 mb-2">
            Your cart is empty
          </h3>
          <p className="text-[13px] text-neutral-500 mb-8 max-w-62.5">
            Discover premium architectural assets and industrial design objects.
          </p>
          <button
            onClick={closeCart}
            className="bg-neutral-900 text-white px-8 py-3.5 rounded-full text-[13px] font-semibold uppercase tracking-wide hover:bg-neutral-800 transition-colors w-full"
          >
            Start Curating
          </button>
        </div>
      </motion.div>
    </>
  );
}
