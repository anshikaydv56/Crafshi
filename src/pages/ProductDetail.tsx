import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, Award, MapPin, Calendar, Ruler } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = products.find(p => p.id === parseInt(id || '0'));

  if (!product) {
    return (
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-amber-900 mb-4">Product not found</h1>
          <Link to="/" className="text-amber-600 hover:text-amber-800">Return to home</Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart({ ...product, quantity });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-amber-600">
            <li><Link to="/" className="hover:text-amber-800 custom-cursor">Home</Link></li>
            <li>/</li>
            <li><Link to={`/category/${product.category}`} className="hover:text-amber-800 custom-cursor capitalize">{product.category}</Link></li>
            <li>/</li>
            <li className="text-amber-800">{product.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="glass-effect rounded-2xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 lg:h-[600px] object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-playfair font-bold text-amber-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-amber-200'
                      }`}
                    />
                  ))}
                  <span className="text-amber-600 ml-2">({product.rating})</span>
                </div>
                <span className="text-amber-500">•</span>
                <span className="text-amber-600">{product.inStock} in stock</span>
              </div>
              <p className="text-4xl font-bold text-amber-800 mb-6">
                ₹{product.price.toLocaleString()}
              </p>
            </div>

            {/* Seller Info */}
            <div className="glass-effect rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Award className="h-6 w-6 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-900">{product.seller}</p>
                  <div className="flex items-center text-amber-600 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {product.location}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-amber-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Made in {product.yearMade}
                </div>
                <div className="flex items-center">
                  <Ruler className="h-4 w-4 mr-1" />
                  {product.dimensions}
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium text-amber-800">Quantity:</label>
                <div className="flex items-center border-2 border-amber-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-amber-600 hover:bg-amber-50 custom-cursor"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-amber-800 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.inStock, quantity + 1))}
                    className="px-3 py-2 text-amber-600 hover:bg-amber-50 custom-cursor"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 px-8 rounded-full font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 hover:scale-105 custom-cursor flex items-center justify-center"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-4 rounded-full border-2 transition-all duration-300 hover:scale-110 custom-cursor ${
                      isWishlisted
                        ? 'bg-red-500 border-red-500 text-white'
                        : 'border-amber-300 text-amber-600 hover:bg-amber-50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-4 rounded-full border-2 border-amber-300 text-amber-600 hover:bg-amber-50 transition-all duration-300 hover:scale-110 custom-cursor"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 glass-effect rounded-lg">
                <Truck className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-900">Free Shipping</p>
                  <p className="text-xs text-amber-600">On orders above ₹10,000</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 glass-effect rounded-lg">
                <Shield className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-900">Authentic</p>
                  <p className="text-xs text-amber-600">Verified handcrafted</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 glass-effect rounded-lg">
                <RotateCcw className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-900">7 Day Return</p>
                  <p className="text-xs text-amber-600">Easy returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="border-b border-amber-200 mb-8">
            <nav className="flex space-x-8">
              {['description', 'details', 'story'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 text-lg font-medium capitalize custom-cursor ${
                    activeTab === tab
                      ? 'border-b-2 border-amber-600 text-amber-600'
                      : 'text-amber-700 hover:text-amber-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="glass-effect rounded-2xl p-8">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-2xl font-playfair font-bold text-amber-900 mb-4">Description</h3>
                <p className="text-amber-700 leading-relaxed text-lg">{product.description}</p>
                <div className="mt-6">
                  <h4 className="font-semibold text-amber-900 mb-3">Materials Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((material, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div>
                <h3 className="text-2xl font-playfair font-bold text-amber-900 mb-4">Product Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-amber-200">
                      <span className="font-medium text-amber-800">Dimensions:</span>
                      <span className="text-amber-700">{product.dimensions}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-amber-200">
                      <span className="font-medium text-amber-800">Weight:</span>
                      <span className="text-amber-700">{product.weight}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-amber-200">
                      <span className="font-medium text-amber-800">Origin:</span>
                      <span className="text-amber-700">{product.origin}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-amber-200">
                      <span className="font-medium text-amber-800">Technique:</span>
                      <span className="text-amber-700">{product.technique}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-amber-200">
                      <span className="font-medium text-amber-800">Year Made:</span>
                      <span className="text-amber-700">{product.yearMade}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-amber-200">
                      <span className="font-medium text-amber-800">In Stock:</span>
                      <span className="text-amber-700">{product.inStock} pieces</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'story' && (
              <div>
                <h3 className="text-2xl font-playfair font-bold text-amber-900 mb-4">Artisan's Story</h3>
                <p className="text-amber-700 leading-relaxed text-lg mb-6">{product.story}</p>
                <div className="glass-effect p-6 rounded-xl bg-amber-50/50">
                  <div className="flex items-center space-x-4 mb-4">
                    <Award className="h-8 w-8 text-amber-600" />
                    <div>
                      <h4 className="font-semibold text-amber-900">{product.seller}</h4>
                      <p className="text-amber-600">{product.location}</p>
                    </div>
                  </div>
                  <p className="text-amber-700">
                    A master craftsperson preserving the traditional art forms of India. 
                    Each piece is created with dedication to maintaining the authenticity 
                    and quality that has been passed down through generations.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-playfair font-bold text-amber-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="group glass-effect rounded-2xl overflow-hidden hover-lift custom-cursor"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-playfair font-semibold text-amber-900 mb-2 group-hover:text-amber-700 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-amber-800 font-bold">₹{relatedProduct.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;