import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

// --- TEMPORARY MOCK DATA FOR UI TESTING ---
const MOCK_CART = [
  {
    id: "1",
    name: "Brushed Brass Linear Handle",
    category: "Hardware",
    price: 145.0,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "2",
    name: "The Curator Oak Side Chair",
    category: "Furniture",
    price: 890.0,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=200&q=80",
  },
];

export default function CartDrawer({ isOpen, onClose }) {
  // Prevent scrolling on the main page when the drawer is active
  if (isOpen) {
    // eslint-disable-next-line react-hooks/immutability
    document.body.style.overflow = "hidden";
  } else {
    // eslint-disable-next-line react-hooks/immutability
    document.body.style.overflow = "unset";
  }

  // Calculate the temporary subtotal
  const subtotal = MOCK_CART.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Sliding Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-md bg-white shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#111827]" />
                <h2 className="text-lg font-bold tracking-widest text-[#111827] uppercase">
                  Cart
                </h2>
                <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-[#111827] rounded-full">
                  {MOCK_CART.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-[#111827]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List (Scrollable) */}
            <div className="flex-1 px-6 py-6 overflow-y-auto">
              {MOCK_CART.length > 0 ? (
                <div className="space-y-8">
                  {MOCK_CART.map((item) => (
                    <div key={item.id} className="flex gap-5 group">
                      {/* Item Image */}
                      <div className="w-24 h-24 overflow-hidden bg-gray-50 aspect-square">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
                              {item.category}
                            </p>
                            <h3 className="text-[13px] font-medium text-[#111827] leading-snug">
                              {item.name}
                            </h3>
                          </div>
                          <button className="text-gray-300 hover:text-red-500 transition-colors ml-2 mt-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-end justify-between mt-auto">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-gray-200">
                            <button className="p-1.5 text-gray-500 hover:text-[#111827] hover:bg-gray-50 transition-colors">
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-[12px] font-medium text-center text-[#111827]">
                              {item.quantity}
                            </span>
                            <button className="p-1.5 text-gray-500 hover:text-[#111827] hover:bg-gray-50 transition-colors">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Item Price */}
                          <p className="text-[13px] font-medium tracking-wide text-[#111827]">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty Cart State */
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-200" />
                  <div>
                    <p className="text-[#111827] font-medium">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Curate your collection to get started.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 mt-4 text-[12px] font-bold tracking-widest text-[#111827] uppercase border border-[#111827] hover:bg-[#111827] hover:text-white transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer / Checkout Action */}
            {MOCK_CART.length > 0 && (
              <div className="px-6 py-6 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[13px] font-bold tracking-widest text-gray-500 uppercase">
                    Subtotal
                  </span>
                  <span className="text-xl font-bold text-[#111827]">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-[12px] text-gray-500 mb-6">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="flex items-center justify-center w-full py-4 text-[12px] font-bold tracking-widest text-white uppercase transition-colors bg-[#111827] hover:bg-gray-800"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
