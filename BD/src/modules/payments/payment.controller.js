import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Stripe Payment Intent
// @route   POST /api/v1/payments/stripe/create-intent
export const createStripeIntent = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ error: 'Invalid total amount' });
    }

    const amountInCents = Math.round(totalAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe Intent Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create Razorpay Order
// @route   POST /api/v1/payments/razorpay/create-order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    const amount = Number(totalAmount);

    // Guard against NaN / non-positive / non-finite amounts before hitting Razorpay
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid total amount provided.',
      });
    }

    const amountInINR = amount * 83; // USD to INR conversion
    const amountInPaise = Math.round(amountInINR * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ ...order, formattedINR: amountInINR });
  } catch (error) {
    console.error('Razorpay Order Error:', error);

    // Razorpay errors arrive as { error: { code, description, ... } }
    const razorError = error?.error;
    const description =
      razorError?.description ||
      razorError?.reason ||
      error?.message ||
      'Failed to create Razorpay order.';

    // BAD_REQUEST_ERROR covers "Amount exceeds maximum amount allowed" and
    // "Amount is less than minimum amount allowed" — surface these as 400
    // so the client can show a meaningful, actionable message.
    const isBadRequest =
      razorError?.code === 'BAD_REQUEST_ERROR' ||
      error?.statusCode === 400 ||
      error?.raw?.statusCode === 400;

    res.status(isBadRequest ? 400 : 500).json({
      success: false,
      message: description,
    });
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/v1/payments/razorpay/verify-payment
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      return res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Razorpay Verify Error:', error);
    res.status(500).json({ error: error.message });
  }
};