const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  res.json({ success: true, user });
};

exports.addToCart = async (req,res) => {
  const { productId, qty=1 } = req.body;
  const user = await User.findById(req.user.userId);
  const idx = user.cart.findIndex(c => c.product.toString() === productId);
  if (idx > -1) user.cart[idx].qty += qty;
  else user.cart.push({ product: productId, qty });
  await user.save();
  res.json({ success: true, cart: user.cart });
};

exports.removeFromCart = async (req,res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user.userId);
  user.cart = user.cart.filter(c => c.product.toString() !== productId);
  await user.save();
  res.json({ success: true, cart: user.cart });
};

exports.getCart = async (req,res) => {
  const user = await User.findById(req.user.userId).populate('cart.product');
  res.json({ success: true, cart: user.cart });
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { name, phone, address } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Generate token (e.g., random string)
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`;

    await sendEmail(user.email, 'Password Reset Request', message);

    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    user.password = newPassword; // Make sure password hashing happens in model pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
