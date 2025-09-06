const User = require("../models/User");

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json({ success:true, user });
};
exports.addToCart = async (req,res)=>{
  const { productId, qty=1 } = req.body;
  const user = await User.findById(req.user.userId);
  const idx = user.cart.findIndex(c=>c.product.toString()===productId);
  if (idx>-1) user.cart[idx].qty += qty;
  else user.cart.push({ product:productId, qty });
  await user.save();
  res.json({ success:true, cart:user.cart });
};

exports.removeFromCart = async (req,res)=>{
  const { productId } = req.params;
  const user = await User.findById(req.user.userId);
  user.cart = user.cart.filter(c=>c.product.toString()!==productId);
  await user.save();
  res.json({ success:true, cart:user.cart });
};

exports.getCart = async (req,res)=>{
  const user = await User.findById(req.user.userId).populate("cart.product");
  res.json({ success:true, cart:user.cart });
};
