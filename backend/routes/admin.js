const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const adminController = require('../controllers/adminController');

// Admin only - get all users
router.get('/users', authMiddleware, roleMiddleware(['admin']), adminController.getAllUsers);

// Admin only - update user role
router.put('/users/role', authMiddleware, roleMiddleware(['admin']), adminController.updateUserRole);

router.get('/products/pending', authMiddleware, roleMiddleware(['admin']), adminController.getPendingProducts);

router.put('/products/approval', authMiddleware, roleMiddleware(['admin']), adminController.updateProductApproval);


module.exports = router;
