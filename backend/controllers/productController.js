const Product = require("../models/Product");
const { uploadImage, deleteImage } = require("../utils/cloudinary");

// Create
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, stock, images = [] } = req.body;

    const uploaded = [];
    for (const base64 of images) {
      const img = await uploadImage(base64); // base64 string from client
      uploaded.push(img);
    }

    const product = await Product.create({
      name, description, price, category, brand,
      stock: stock || 0, images: uploaded,
      createdBy: req.user.userId
    });

    res.status(201).json({ success:true, product });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};

// Read (list) with search, filter, paginate
exports.getProducts = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip  = (page-1)*limit;

    const keyword = req.query.keyword ? {
      name: { $regex: req.query.keyword, $options: "i" }
    } : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const min = req.query.min ? Number(req.query.min) : 0;
    const max = req.query.max ? Number(req.query.max) : Number.MAX_SAFE_INTEGER;
    const priceFilter = { price: { $gte:min, $lte:max } };

    const query = { ...keyword, ...category, ...priceFilter };

    const [products, count] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    res.json({ success:true, products, total:count, page, pages: Math.ceil(count/limit) });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};

// Read single
exports.getProduct = async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ success:false, message:"Not found" });
  res.json({ success:true, product:p });
};

// Update
exports.updateProduct = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ success:false, message:"Not found" });

    // handle replace images (optional)
    if (req.body.images?.length) {
      for (const im of prod.images) await deleteImage(im.public_id);
      const uploaded = [];
      for (const base64 of req.body.images) {
        uploaded.push(await uploadImage(base64));
      }
      prod.images = uploaded;
    }

    ["name","description","price","category","brand","stock"].forEach(k=>{
      if (req.body[k] !== undefined) prod[k] = req.body[k];
    });

    await prod.save();
    res.json({ success:true, product:prod });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};

// Delete
exports.deleteProduct = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ success:false, message:"Not found" });
    for (const im of prod.images) await deleteImage(im.public_id);
    await prod.deleteOne();
    res.json({ success:true, message:"Deleted" });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};

// Create/Update Review
exports.reviewProduct = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success:false, message:"Not found" });

    const already = product.reviews.find(r => r.user.toString() === req.user.userId);
    if (already) {
      already.rating = rating;
      already.comment = comment;
    } else {
      product.reviews.push({ user:req.user.userId, name:req.user.userId, rating, comment });
      product.numReviews = product.reviews.length;
    }
    // recompute avg
    product.ratings = product.reviews.reduce((a,c)=>a+c.rating,0) / product.reviews.length || 0;

    await product.save();
    res.json({ success:true, reviews:product.reviews, ratings:product.ratings, numReviews:product.numReviews });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};
