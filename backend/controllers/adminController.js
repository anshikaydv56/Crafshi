const User = require('../models/User');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success:true, users });
  } catch (error) {
    res.status(500).json({ success:false, message: error.message });
  }
};
const Product = require('../models/Product');

// Get products pending approval
exports.getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ approved: false, isActive: true });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve or reject product
exports.updateProductApproval = async (req, res) => {
  try {
    const { productId, approve, notes } = req.body;
    if (typeof approve !== 'boolean') return res.status(400).json({ success: false, message: 'Approval status required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    product.approved = approve;
    product.approvalNotes = notes || '';
    await product.save();

    res.json({ success: true, message: `Product ${approve ? 'approved' : 'rejected'}`, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const validRoles = ['customer', 'seller', 'admin'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ success:false, message: 'Invalid role' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success:false, message: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ success:true, message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ success:false, message: error.message });
  }
};
