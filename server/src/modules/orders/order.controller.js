// SERVER/src/modules/orders/order.controller.js
import Order from './order.model.js';
import Product from '../products/product.model.js';
import { ApiError } from '../../utils/ApiError.js';

/**
 * @desc    Create new order
 * @route   POST /api/orders
 */
export const addOrderItems = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, merchantId } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return next(new ApiError(400, 'No order items provided'));
    }
    if (!merchantId) {
      return next(new ApiError(400, 'Merchant ID is required to place an order'));
    }

    let backendCalculatedTotal = 0;
    const validatedItems = [];

    // 1. Validate stock and calculate true prices securely
    for (const item of orderItems) {
      const dbProduct = await Product.findById(item.product);

      if (!dbProduct) {
        return next(new ApiError(404, `Product not found: ${item.product}`));
      }

      // Check Inventory
      if (dbProduct.inventory.stockQuantity < item.quantity) {
        return next(new ApiError(400, `Insufficient stock for ${dbProduct.title}. Only ${dbProduct.inventory.stockQuantity} left.`));
      }

      // Calculate total using the secure database price
      backendCalculatedTotal += (dbProduct.price * item.quantity);

      validatedItems.push({
        name: dbProduct.title,
        product: dbProduct._id,
        quantity: item.quantity,
        price: dbProduct.price, // Snapshot historical price
        image: item.image || (dbProduct.images[0] ? dbProduct.images[0].url : '')
      });
    }

    // 2. Create the order securely
    const order = await Order.create({
      user: req.user._id,
      merchantId, 
      orderItems: validatedItems,
      shippingAddress,
      paymentMethod,
      totalPrice: backendCalculatedTotal, // Secured backend calculation!
      status: 'Pending'
    });

    // 3. Deduct inventory securely using MongoDB atomic operators
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { 'inventory.stockQuantity': -item.quantity } }
      );
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(new ApiError(500, 'Error creating order', error.message));
  }
};

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/orders/myorders
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(new ApiError(500, 'Error fetching your orders', error.message));
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .lean(); 

    if (!order) return next(new ApiError(404, 'Order not found'));

    // Security Check: Only the customer who bought it, the merchant who sold it, or an admin can view it.
    const isCustomer = order.user._id.toString() === req.user._id.toString();
    const isMerchant = order.merchantId.toString() === req.user._id.toString();
    
    if (!isCustomer && !isMerchant && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Not authorized to view this order'));
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(new ApiError(500, 'Error fetching order', error.message));
  }
};

/**
 * @desc    Update order status to paid
 * @route   PUT /api/orders/:id/pay
 */
export const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { isPaid: true, paidAt: Date.now(), status: 'Processing' },
      { new: true, runValidators: true }
    );

    if (!order) return next(new ApiError(404, 'Order not found'));
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(new ApiError(500, 'Error updating payment status', error.message));
  }
};

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 */
export const getOrders = async (req, res, next) => {
  try {
    // If the user is a merchant, only show THEIR orders. If admin, show ALL.
    const query = req.user.role === 'merchant' ? { merchantId: req.user._id } : {};

    const orders = await Order.find(query)
      .populate('user', 'id name')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(new ApiError(500, 'Error fetching all orders', error.message));
  }
};