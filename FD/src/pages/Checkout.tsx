import { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, Smartphone, Loader2, AlertCircle } from 'lucide-react';

import StripeCheckoutForm from '../pages/storefront/checkout/StripeCheckoutForm';
import { useCreateStripeIntentMutation, useCreateRazorpayOrderMutation, useVerifyRazorpayPaymentMutation } from '../features/api/apiSlice';
import type { RootState } from '../app/store';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? (await import('@stripe/stripe-js')).loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const cart = useSelector((state: RootState) => state.cart);
  const navigate = useNavigate();

  const totalAmount = cart.totalAmount || 0;
  const items = cart.items || [];

  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay'>('stripe'); 
  const [clientSecret, setClientSecret] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const initializedRef = useRef(false);
  const currentPaymentMethodRef = useRef(paymentMethod);

  const [createStripeIntent] = useCreateStripeIntentMutation();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment] = useVerifyRazorpayPaymentMutation();

  useEffect(() => {
    currentPaymentMethodRef.current = paymentMethod;
  }, [paymentMethod]);

  useEffect(() => {
    if (totalAmount <= 0 || paymentMethod !== 'stripe' || !stripePromise) {
      return;
    }

    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    setIsInitializing(true);
    setInitError(null);

    createStripeIntent(totalAmount)
      .unwrap()
      .then((data) => {
        if (currentPaymentMethodRef.current === 'stripe') {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            setInitError('Missing client secret from payment provider.');
          }
        }
      })
      .catch((err) => {
        console.error('Stripe Init Error:', err);
        if (currentPaymentMethodRef.current === 'stripe') {
          setInitError(err?.data?.message || 'Failed to initialize payment. Please try again.');
        }
      })
      .finally(() => {
        setIsInitializing(false);
      });
  }, [totalAmount, paymentMethod, createStripeIntent, stripePromise]);

  const handleRazorpayPayment = async () => {
    try {
      setIsRazorpayLoading(true);
      setInitError(null);

      const orderData = await createRazorpayOrder(totalAmount).unwrap();
      if (!orderData.id) throw new Error('Failed to create Razorpay Order');

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'THE ARCHITECTURAL',
        description: `Securing ${items.length} Artifact(s)`,
        order_id: orderData.id,
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          try {
            await verifyRazorpayPayment(response).unwrap();
            navigate('/payment-success');
          } catch (err) {
            alert('Payment verification failed!');
          }
        },
        theme: { color: '#333333' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Razorpay Error:', err);
      setInitError(err?.data?.message || err?.error || 'Could not initiate Razorpay. Please try again.');
    } finally {
      setIsRazorpayLoading(false);
    }
  };

  const stripeAppearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#333333',
      colorBackground: '#ffffff',
      colorText: '#333333',
      fontFamily: 'serif',
      borderRadius: '0px',
    },
  };

  return (
    <div className="w-full bg-ivory min-h-screen pt-32 pb-32 flex justify-center">
      <div className="max-w-3xl w-full px-6 text-center">
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
          <div className="py-12 flex flex-col items-center">
            <p className="text-stone text-sm mb-2">
              You are securing {items.length} artifacts.
            </p>
            <div className="text-3xl font-serif text-charcoal mb-10">
              Total: $
              {(totalAmount || 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>

            {initError && (
              <div className="w-full max-w-lg mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{initError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 w-full max-w-lg mb-8">
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('stripe');
                  setInitError(null);
                  setClientSecret('');
                  initializedRef.current = false;
                }}
                className={`py-4 px-4 border flex items-center justify-center gap-2 text-[11px] font-bold tracking-widest uppercase transition-all cursor-pointer ${
                  paymentMethod === 'stripe'
                    ? 'border-charcoal bg-charcoal text-white shadow-sm'
                    : 'border-stone-200 bg-white text-stone-500 hover:border-stone-400'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Card / Apple Pay
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('razorpay');
                  setInitError(null);
                }}
                className={`py-4 px-4 border flex items-center justify-center gap-2 text-[11px] font-bold tracking-widest uppercase transition-all cursor-pointer ${
                  paymentMethod === 'razorpay'
                    ? 'border-charcoal bg-charcoal text-white shadow-sm'
                    : 'border-stone-200 bg-white text-stone-500 hover:border-stone-400'
                }`}
              >
                <Smartphone className="w-4 h-4" /> UPI / NetBanking
              </button>
            </div>

            <div className="w-full max-w-lg bg-white p-8 border border-stone-200 text-left shadow-sm">
              {paymentMethod === 'stripe' && (
                <>
                  {!stripePromise ? (
                    <div className="text-center py-8 text-red-500 text-sm">
                      Stripe is not configured. Please set VITE_STRIPE_PUBLISHABLE_KEY in your environment.
                    </div>
                  ) : isInitializing ? (
                    <div className="py-12 flex flex-col items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-charcoal mb-3" />
                      <p className="text-[11px] font-bold tracking-widest uppercase text-stone-400">
                        Loading Secure Server...
                      </p>
                    </div>
                  ) : clientSecret ? (
                    <Elements options={{ clientSecret, appearance: stripeAppearance }} stripe={stripePromise}>
                      <StripeCheckoutForm totalAmount={totalAmount} />
                    </Elements>
                  ) : (
                    <div className="text-center py-8 text-red-500 text-sm">
                      Failed to load payment intent. Ensure backend server is running.
                    </div>
                  )}
                </>
              )}

              {paymentMethod === 'razorpay' && (
                <div className="text-center py-6">
                  <p className="text-sm text-stone-500 mb-2">
                    Fast & Secure payment via Google Pay, PhonePe, Paytm, UPI, or Indian NetBanking.
                  </p>
                  <p className="text-xs text-stone-400 mb-8">
                    (Equivalent to ≈ ₹{(totalAmount * 83).toLocaleString('en-IN')} INR)
                  </p>
                  
                  {!import.meta.env.VITE_RAZORPAY_KEY_ID && (
                    <p className="text-xs text-red-500 mb-4">
                      Razorpay is not configured. Please set VITE_RAZORPAY_KEY_ID in your environment.
                    </p>
                  )}
                  
                  <button
                    type="button"
                    onClick={handleRazorpayPayment}
                    disabled={isRazorpayLoading || !import.meta.env.VITE_RAZORPAY_KEY_ID}
                    className="w-full bg-charcoal text-white py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-stone-800 transition-colors flex justify-center items-center cursor-pointer disabled:opacity-50"
                  >
                    {isRazorpayLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      `Proceed with Razorpay`
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
