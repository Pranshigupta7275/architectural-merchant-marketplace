import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";


import {
  addItemToCart,
  removeItemFromCart,
} from "../../features/cart/cartSlice";

export default function Cart() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

 
  const cartItems = cart.items || [];

  
  const subtotal = cart.totalAmount || 0;

  return (
    <div className="min-h-screen bg-ivory pt-32 pb-24">
      <div className="max-w-300 mx-auto px-6 md:px-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 border-b border-stone/20 pb-8"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-3">
            Your Curation
          </h1>
          <p className="font-sans text-[11px] font-bold tracking-widest uppercase text-stone">
            {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"} in
            Collection
          </p>
        </motion.div>

        {cartItems.length === 0 ? (
          /* --- PREMIUM EMPTY STATE --- */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-24"
          >
            <p className="font-serif text-2xl text-charcoal mb-6">
              Your collection is currently empty.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center text-[11px] font-bold tracking-widest uppercase text-charcoal hover:text-brass transition-colors border-b border-charcoal hover:border-brass pb-1"
            >
              Return to Archive <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          /* --- POPULATED CART LAYOUT --- */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-10">
              {cartItems.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  key={item.id || item._id}
                  className="flex flex-col sm:flex-row gap-8 pb-10 border-b border-stone/15 relative group"
                >
                  {/* Editorial Aspect Ratio Image */}
                  <div className="w-full sm:w-40 aspect-4/5 bg-stone/5 overflow-hidden">
                    <img
                      src={
                        item.images?.[0] ||
                        "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=400"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-sans text-[12px] font-bold tracking-widest uppercase text-charcoal mb-2">
                          {item.name}
                        </h3>
                        <p className="text-sm font-medium text-charcoal/80">
                          ${Number(item.price).toFixed(2)}
                        </p>
                      </div>

                      {/* ✅ Remove Button: Dispatches exact item ID */}
                      <button
                        onClick={() =>
                          dispatch(removeItemFromCart(item.id || item._id))
                        }
                        className="text-stone hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-stone/30 w-28 mt-6 sm:mt-0">
                      {/* ✅ Minus Button: Dispatches exact item ID */}
                      <button
                        onClick={() =>
                          dispatch(removeItemFromCart(item.id || item._id))
                        }
                        className="p-3 text-charcoal hover:text-brass transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="flex-1 text-center text-xs font-medium text-charcoal">
                        {/* ✅ Correctly maps to item.quantity instead of cartQuantity */}
                        {item.quantity}
                      </span>

                      {/* ✅ Plus Button: Dispatches entire item payload */}
                      <button
                        onClick={() => dispatch(addItemToCart(item))}
                        className="p-3 text-charcoal hover:text-brass transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-4"
            >
              <div className="bg-white p-8 shadow-premium border border-stone/5 sticky top-32">
                <h3 className="font-sans text-[11px] font-bold tracking-widest uppercase text-charcoal mb-6 border-b border-stone/15 pb-4">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-8 text-sm text-charcoal/80">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-stone">Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8 border-t border-stone/15 pt-4">
                  <span className="font-serif text-lg text-charcoal">
                    Total
                  </span>
                  <span className="font-serif text-xl text-charcoal">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <Link
                  to="/checkout"
                  className="w-full flex items-center justify-center bg-charcoal text-white py-4 text-[11px] font-bold tracking-widest uppercase hover:bg-brass transition-colors"
                >
                  Proceed to Checkout
                </Link>

                <div className="mt-6 text-center">
                  <p className="text-[10px] text-stone uppercase tracking-widest flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>{" "}
                    Secure Checkout
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
