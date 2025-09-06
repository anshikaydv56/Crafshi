const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    // req.user = { userId, iat, exp } – from auth middleware
    const me = await User.findById(req.user.userId);
    if (!me) return res.status(401).json({ success:false, message:"User not found" });
    if (me.role !== "admin" && me.role !== "seller")
      return res.status(403).json({ success:false, message:"Forbidden: Admin/Seller only" });
    next();
  } catch (e) {
    res.status(500).json({ success:false, message:e.message });
  }
};
