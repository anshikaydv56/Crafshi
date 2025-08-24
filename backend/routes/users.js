const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('wishlist', 'name price images')
      .populate({
        path: 'orders',
        select: 'orderNumber status pricing.total createdAt',
        options: { sort: { createdAt: -1 }, limit: 5 }
      });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('phone').optional().matches(/^[0-9]{10}$/),
  body('address.street').optional().trim().isLength({ min: 5, max: 100 }),
  body('address.city').optional().trim().isLength({ min: 2, max: 50 }),
  body('address.state').optional().trim().isLength({ min: 2, max: 50 }),
  body('address.pincode').optional().matches(/^[0-9]{6}$/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId, 
      updates, 
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/users/wishlist/:productId
// @desc    Add product to wishlist
// @access  Private
router.post('/wishlist/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    const user = await User.findById(req.user.userId);
    
    // Check if already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product already in wishlist' 
      });
    }

    user.wishlist.push(productId);
    await user.save();

    await user.populate('wishlist', 'name price images');

    res.json({
      success: true,
      message: 'Product added to wishlist',
      data: user.wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/users/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/wishlist/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.userId);
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    await user.populate('wishlist', 'name price images');

    res.json({
      success: true,
      message: 'Product removed from wishlist',
      data: user.wishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/users/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/wishlist', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('wishlist', 'name price images rating seller inStock');

    res.json({
      success: true,
      data: user.wishlist
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: 'orders',
        select: 'orderNumber status pricing.total createdAt',
        options: { sort: { createdAt: -1 }, limit: 5 }
      })
      .populate('wishlist', 'name price images');

    // Get order statistics
    const orderStats = await User.aggregate([
      { $match: { _id: user._id } },
      {
        $lookup: {
          from: 'orders',
          localField: 'orders',
          foreignField: '_id',
          as: 'orderDetails'
        }
      },
      {
        $project: {
          totalOrders: { $size: '$orderDetails' },
          totalSpent: { $sum: '$orderDetails.pricing.total' },
          pendingOrders: {
            $size: {
              $filter: {
                input: '$orderDetails',
                cond: { $eq: ['$$this.status', 'pending'] }
              }
            }
          }
        }
      }
    ]);

    const stats = orderStats[0] || { totalOrders: 0, totalSpent: 0, pendingOrders: 0 };

    res.json({
      success: true,
      data: {
        user,
        stats: {
          ...stats,
          wishlistItems: user.wishlist.length
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;