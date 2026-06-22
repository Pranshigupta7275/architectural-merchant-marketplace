import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// Adjust this path if your cartSlice is in a different folder
import {
  addItemToCart,
  removeItemFromCart,
} from "../../features/cart/cartSlice";

export default function CartDrawer({ isOpen, onClose }) {
  // Connects directly to the cartSlice
  const {
    items: cartItems,
    totalAmount,
    totalQuantity,
  } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* THE OVERLAY */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* THE DRAWER PANEL */}
      <div className="relative w-full max-w-120 bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-[12px] font-bold tracking-widest uppercase text-[#111827]">
            Your Cart ({totalQuantity || 0})
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#111827] transition-colors p-2 -mr-2 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems?.length === 0 ? (
            /* EMPTY STATE */
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 pb-12">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#111827] mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 text-[14px] leading-relaxed max-w-[250px]">
                  Discover premium architectural assets and industrial design
                  objects.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  navigate("/shop");
                }}
                className="w-full mt-4 py-4 bg-[#111827] text-white text-[12px] font-bold uppercase tracking-widest rounded-lg hover:bg-gray-800 transition-colors shadow-md cursor-pointer"
              >
                Start Curating
              </button>
            </div>
          ) : (
            /* POPULATED STATE */
            <ul className="space-y-8">
              {cartItems.map((item) => (
                <li key={item.id} className="flex gap-6">
                  {/* Product Image */}
                  <div
                    className="w-24 h-32 bg-gray-50 flex-shrink-0 cursor-pointer"
                    onClick={() => {
                      onClose();
                      navigate(`/architecture/${item.id}`); // Or whatever your detail route is
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details & Controls */}
                  <div className="flex flex-col flex-1 py-1">
                    <div className="flex justify-between mb-1">
                      <h3 className="text-[13px] font-bold text-[#111827] uppercase tracking-wide line-clamp-2">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mb-auto">
                      {item.category}
                    </p>

                    <div className="flex items-end justify-between mt-4">
                      {/* Quantity Selector using your existing slice logic */}
                      <div className="flex items-center border border-gray-200 w-24 h-8 rounded-sm">
                        <button
                          onClick={() => dispatch(removeItemFromCart(item.id))}
                          className="flex-1 flex items-center justify-center text-gray-400 hover:text-[#111827] transition-colors cursor-pointer"
                        >
                          <span className="text-lg leading-none mb-0.5">-</span>
                        </button>
                        <span className="text-[13px] font-medium w-8 text-center text-[#111827]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(addItemToCart({ ...item, quantity: 1 }))
                          }
                          className="flex-1 flex items-center justify-center text-gray-400 hover:text-[#111827] transition-colors cursor-pointer"
                        >
                          <span className="text-lg leading-none mb-0.5">+</span>
                        </button>
                      </div>

                      <p className="text-[14px] font-medium text-[#111827]">
                        $
                        {item.totalPrice?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* STICKY FOOTER */}
        {cartItems?.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-gray-50/50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[12px] uppercase tracking-widest text-gray-500 font-bold">
                Subtotal
              </span>
              <span className="text-lg font-bold text-[#111827]">
                $
                {totalAmount?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mb-6 text-center uppercase tracking-wide">
              Shipping and taxes calculated at checkout.
            </p>
            <button
              onClick={() => {
                onClose();
                navigate("/checkout");
              }}
              className="w-full py-4 bg-[#111827] text-white text-[12px] font-bold uppercase tracking-widest rounded-lg hover:bg-gray-800 transition-colors shadow-md cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
