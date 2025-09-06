const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const reportController = require('../controllers/reportController');

// Admin only route
router.get('/sales/daily', auth, role(['admin']), reportController.getDailySalesReport);

module.exports = router;
