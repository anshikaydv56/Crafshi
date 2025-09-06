const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const adminOrderController = require('../controllers/adminOrderController');

// Sirf admin ko access
router.use(auth);
router.use(role(['admin']));

// Orders list
router.get('/', adminOrderController.getAllOrders);

// Order status update
router.put('/:orderId/status', adminOrderController.updateOrderStatus);

// Order cancel
router.put('/:orderId/cancel', adminOrderController.cancelOrder);

module.exports = router;
