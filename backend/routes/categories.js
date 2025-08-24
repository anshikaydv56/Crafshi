const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories with product counts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = [
      { id: 'pottery', name: 'Pottery', description: 'Handcrafted ceramic and clay items' },
      { id: 'textiles', name: 'Textiles', description: 'Traditional fabrics and clothing' },
      { id: 'jewelry', name: 'Jewelry', description: 'Handmade ornaments and accessories' },
      { id: 'woodwork', name: 'Woodwork', description: 'Carved wooden items and furniture' },
      { id: 'metalcraft', name: 'Metalcraft', description: 'Brass, copper and metal artifacts' },
      { id: 'paintings', name: 'Paintings', description: 'Traditional and folk art paintings' }
    ];

    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await Product.countDocuments({ 
          category: category.id, 
          isActive: true 
        });
        return { ...category, count };
      })
    );

    res.json({
      success: true,
      data: categoriesWithCounts
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/categories/:category/featured
// @desc    Get featured products for a category
// @access  Public
router.get('/:category/featured', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 4 } = req.query;

    if (!['pottery', 'textiles', 'jewelry', 'woodwork', 'metalcraft', 'paintings'].includes(category)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid category' 
      });
    }

    const products = await Product.find({ 
      category, 
      isActive: true,
      isFeatured: true 
    })
    .sort({ 'rating.average': -1, createdAt: -1 })
    .limit(parseInt(limit))
    .select('-reviews');

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get category featured products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/categories/stats
// @desc    Get category statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const stats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgRating: { $avg: '$rating.average' }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          avgPrice: { $round: ['$avgPrice', 0] },
          minPrice: 1,
          maxPrice: 1,
          avgRating: { $round: ['$avgRating', 1] },
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;