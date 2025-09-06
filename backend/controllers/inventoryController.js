const Product = require('../models/Product');

// Stock update karne ke liye
exports.updateStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ success: false, message: 'Invalid product ID or quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    product.inStock = quantity;
    await product.save();

    res.json({ success: true, message: 'Stock updated', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Low stock products list karne ke liye
exports.getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5; // default low stock limit

    const products = await Product.find({ inStock: { $lte: threshold }, isActive: true })
      .sort({ inStock: 1 });

    res.json({ success: true, products, threshold });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
