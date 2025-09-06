const Product = require("../models/Product");
const { uploadImage, deleteImage } = require("../utils/cloudinary");

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, stock, images = [] } = req.body;

    const uploaded = [];
    for (const base64 of images) {
      const img = await uploadImage(base64); // base64 string from client
      uploaded.push(img);
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand,
      inStock: stock || 0,
      images: uploaded,
      seller: {
        userId: req.user.userId,
        // Optionally add seller name and location if available in req.user
      },
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get list of products with search, filter, pagination
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const keyword = req.query.keyword
      ? { $text: { $search: req.query.keyword } }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const min = req.query.min ? Number(req.query.min) : 0;
    const max = req.query.max ? Number(req.query.max) : Number.MAX_SAFE_INTEGER;
    const priceFilter = { price: { $gte: min, $lte: max } };

    const query = { ...keyword, ...category, ...priceFilter, isActive: true };

    const [products, count] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    res.json({ success: true, products, total: count, page, pages: Math.ceil(count / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product by id
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name email');
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // Replace images if provided
    if (req.body.images?.length) {
      for (const im of product.images) {
        if (im.public_id) await deleteImage(im.public_id); // ensure public_id exists
      }
      const uploaded = [];
      for (const base64 of req.body.images) {
        uploaded.push(await uploadImage(base64));
      }
      product.images = uploaded;
    }

    // Update allowed fields
    ["name", "description", "price", "category", "brand", "inStock"].forEach((key) => {
      if (req.body[key] !== undefined) product[key] = req.body[key];
    });

    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    for (const im of product.images) {
      if (im.public_id) await deleteImage(im.public_id);
    }
    await product.deleteOne();
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create or update a product review
exports.reviewProduct = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const existingReviewIndex = product.reviews.findIndex(
      (r) => r.user.toString() === req.user.userId
    );

    if (existingReviewIndex >= 0) {
      product.reviews[existingReviewIndex].rating = rating;
      product.reviews[existingReviewIndex].comment = comment;
      product.reviews[existingReviewIndex].createdAt = Date.now();
    } else {
      product.reviews.push({
        user: req.user.userId,
        rating,
        comment,
        createdAt: Date.now(),
      });
    }

    // Recalculate average rating
    product.calculateAverageRating();

    await product.save();
    res.json({
      success: true,
      reviews: product.reviews,
      rating: product.rating.average,
      numReviews: product.rating.count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
