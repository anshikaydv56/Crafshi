const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    // req.user.userId auth middleware se aata hai
    const me = await User.findById(req.user.userId);
    if (!me) 
      return res.status(401).json({ success: false, message: "User not found" });

    // Role check: admin ya seller hona chahiye
    if (me.role !== "admin" && me.role !== "seller")
      return res.status(403).json({ success: false, message: "Forbidden: Admin/Seller only" });

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
