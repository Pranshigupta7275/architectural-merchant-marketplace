import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Package, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCreateOrderMutation } from '../features/api/customerApi';
import { clearCart } from '../features/cart/cartSlice';
import { useDispatch } from 'react-redux';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  const paymentIntentId = searchParams.get('payment_intent') || searchParams.get('razorpay_payment_id');
  const amount = searchParams.get('amount') || '';

  const [createOrder] = useCreateOrderMutation();

  useEffect(() => {
    const createOrderFromCart = async () => {
      if (!paymentIntentId || isCreatingOrder) return;

      try {
        setIsCreatingOrder(true);
        setOrderError('');

        const cartData = localStorage.getItem('cart');
        const cart = cartData ? JSON.parse(cartData) : { items: [], totalAmount: 0 };

        if (!cart.items || cart.items.length === 0) {
          throw new Error('Cart is empty');
        }

        const orderData = {
          orderItems: cart.items.map((item) => ({
            name: item.title || item.name,
            quantity: item.quantity,
            image: item.image || item.images?.[0]?.url || '',
            price: item.price,
            product: item._id || item.id,
          })),
          shippingAddress: {
            address: '123 Luxury Lane',
            city: 'Design District',
            postalCode: '10001',
            country: 'USA',
          },
          paymentMethod: 'Stripe',
          totalPrice: cart.totalAmount || 0,
        };

        await createOrder(orderData).unwrap();
        dispatch(clearCart());
      } catch (err) {
        console.error('Order creation error:', err);
        setOrderError(err?.data?.message || 'Payment successful, but order creation failed. Please contact support.');
      } finally {
        setIsCreatingOrder(false);
      }
    };

    createOrderFromCart();
  }, [paymentIntentId, isCreatingOrder, createOrder, dispatch]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-lg w-full bg-white rounded-xl border border-gray-200 p-8 md:p-12 text-center shadow-sm"
      >
        {isCreatingOrder ? (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-[#111827] mx-auto mb-4" />
            <h1 className="text-2xl font-serif font-bold text-[#111827] mb-2">Confirming Your Order</h1>
            <p className="text-gray-600 text-sm mb-6">Please wait while we finalize your purchase...</p>
          </>
        ) : orderError ? (
          <>
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#111827] mb-2">Payment Successful</h1>
            <p className="text-gray-600 text-sm mb-2">Your payment was processed, but we encountered an issue creating your order.</p>
            <p className="text-red-600 text-sm mb-6">{orderError}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/shop"
                className="px-6 py-3 bg-[#111827] text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                to="/"
                className="px-6 py-3 border border-gray-200 text-[#111827] text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Return Home
              </Link>
            </div>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </motion.div>
            
            <h1 className="text-2xl font-serif font-bold text-[#111827] mb-2">Payment Successful</h1>
            <p className="text-gray-600 text-sm mb-2">Thank you for your purchase. Your order has been confirmed.</p>
            
            {paymentIntentId && (
              <p className="text-xs text-gray-500 mb-1">
                Payment ID: <span className="font-mono font-bold text-[#111827]">{paymentIntentId}</span>
              </p>
            )}
            
            {amount && (
              <p className="text-lg font-bold text-[#111827] mb-6">
                Total: ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/account"
                className="px-6 py-3 bg-[#111827] text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                View Orders <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop"
                className="px-6 py-3 border border-gray-200 text-[#111827] text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
