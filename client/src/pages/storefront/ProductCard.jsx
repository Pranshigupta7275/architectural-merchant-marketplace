import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { addItemToCart, removeItemFromCart } from "../../features/cart/cartSlice";

export default function CartDrawer({ isOpen, onClose }) {
  const {
    items: cartItems,
    totalAmount,
    totalQuantity,
  } = useSelector((state) => state.cart);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Safety check: if onClose isn't passed properly from the layout, we need to know
  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof onClose === 'function') {
      onClose();
    } else {
      console.error("CartDrawer is missing the onClose prop!");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            onClick={handleClose}
          />

          {/* Drawer Panel */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-[480px] bg-white h-full flex flex-col shadow-2xl pointer-events-auto"
          >
            {/* --- HEADER --- */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-charcoal" />
                <h2 className="text-[12px] font-bold tracking-widest uppercase text-[#111827] mt-0.5">
                  Cart <span className="bg-charcoal text-white text-[9px] px-1.5 py-0.5 rounded-full ml-1">{totalQuantity || 0}</span>
                </h2>
              </div>

              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-[#111827] transition-colors p-2 -mr-2 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* --- SCROLLABLE CONTENT --- */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              {cartItems?.length === 0 ? (
                // Empty State
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 pb-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                    <ShoppingBag className="w-6 h-6 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#111827] mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500 text-[14px] leading-relaxed max-w-[250px]">
                      Discover premium architectural assets and industrial design objects.
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleClose();
                      navigate("/shop");
                    }}
                    className="w-full mt-4 py-4 bg-[#111827] text-white text-[12px] font-bold uppercase tracking-widest rounded-lg hover:bg-gray-800 transition-colors shadow-md cursor-pointer"
                  >
                    Start Curating
                  </button>
                </div>
              ) : (
                // Dynamic Populated State
                <ul className="space-y-8">
                  {cartItems.map((item) => {
                    const uniqueId = item._id || item.id;

                    return (
                      <li key={uniqueId} className="flex gap-6">
                        {/* Image Link */}
                        <div
                          className="w-24 h-32 bg-gray-50 flex-shrink-0 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            handleClose();
                            navigate(`/architecture/${uniqueId}`);
                          }}
                        >
                          <img
                            src={item.image || item.images?.[0] || "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40"}
                            alt={item.name}
                            className="w-full h-full object-cover mix-blend-multiply"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex flex-col flex-1 py-1 justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                {item.category}
                              </p>
                              {/* Dynamic Remove Button */}
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  dispatch(removeItemFromCart(uniqueId));
                                }}
                                className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <h3 className="text-[13px] font-medium text-[#111827] leading-snug pr-4">
                              {item.name}
                            </h3>
                          </div>

                          {/* Dynamic Controls */}
                          <div className="flex items-end justify-between mt-4">
                            <div className="flex items-center border border-gray-200 h-8 rounded-sm">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  dispatch(removeItemFromCart(uniqueId));
                                }}
                                className="w-8 flex items-center justify-center text-gray-400 hover:text-[#111827] transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              
                              <span className="text-[12px] font-medium w-6 text-center text-[#111827]">
                                {item.quantity}
                              </span>
                              
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  dispatch(addItemToCart({ ...item, id: uniqueId, quantity: 1 }));
                                }}
                                className="w-8 flex items-center justify-center text-gray-400 hover:text-[#111827] transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <p className="text-[13px] font-medium text-[#111827]">
                              ${(item.totalPrice || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* --- STICKY FOOTER --- */}
            {cartItems?.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-white z-10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[12px] uppercase tracking-widest text-gray-500 font-bold">
                    Subtotal
                  </span>
                  <span className="text-xl font-medium text-[#111827]">
                    ${(totalAmount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mb-6 text-left">
                  Shipping and taxes calculated at checkout.
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleClose();
                    navigate("/checkout");
                  }}
                  className="w-full py-4 bg-[#111827] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brass transition-colors shadow-md cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}