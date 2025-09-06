const Order = require('../models/Order');
const Product = require('../models/Product');
const notificationController = require('./notificationController');

// Order status update (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      'pending', 'confirmed', 'processing',
      'shipped', 'delivered', 'cancelled', 'returned'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentInfo, pricing, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }

    // Validate each product availability and price
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({ success: false, message: `Product not found or inactive: ${item.product}` });
      }
      if (product.inStock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for product ${product.name}` });
      }
    }

    // Create order items with seller info and price
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        return {
          product: product._id,
          quantity: item.quantity,
          price: product.price,
          seller: product.seller
        };
      })
    );

    const order = new Order({
      user: req.user.userId,
      items: orderItems,
      shippingAddress,
      paymentInfo,
      pricing,
      status: 'pending',
      notes
    });

    await order.save();

    // Reduce product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { inStock: -item.quantity } });
    }

    // Send order confirmation email asynchronously (no top-level await)
    notificationController.sendOrderConfirmation(req.user.email, order).catch(console.error);

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders for logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single order by id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order || order.user.toString() !== req.user.userId) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.user.toString() !== req.user.userId) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status === 'cancelled' || order.status === 'delivered') {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled' });
    }

    order.status = 'cancelled';
    order.cancelReason = req.body.reason || 'No reason provided';
    await order.save();

    // Optionally restock items
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { inStock: item.quantity } });
    }

    res.json({ success: true, message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update payment status (e.g. webhook from payment gateway)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { transactionId, status } = req.body;
    const order = await Order.findOne({ 'paymentInfo.transactionId': transactionId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentInfo.status = status;
    await order.save();

    res.json({ success: true, message: 'Payment status updated', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
