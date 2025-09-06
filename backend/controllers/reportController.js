const Order = require('../models/Order');

// Daily sales report
exports.getDailySalesReport = async (req, res) => {
  try {
    const { date } = req.query; // 'YYYY-MM-DD' format

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date parameter is required' });
    }

    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const orders = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lt: end }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$pricing.total' },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    const data = orders.length ? orders[0] : { totalSales: 0, totalOrders: 0 };

    res.json({ success: true, date, totalSales: data.totalSales, totalOrders: data.totalOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
