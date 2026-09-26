import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';

export default function StripeCheckoutForm({ totalAmount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PaymentElement className="mb-8" />
      
      {errorMessage && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-charcoal text-white py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-stone-800 transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          `Pay $${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        )}
      </button>
    </form>
  );
}