const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.put('/update-stock', auth, admin, [
  body('productId').isMongoId(),
  body('quantity').isInt({ min: 0 })
], inventoryController.updateStock);

router.get('/low-stock', auth, admin, inventoryController.getLowStockProducts);

module.exports = router;
