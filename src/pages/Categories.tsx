import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, Grid, List, Star, SortAsc } from 'lucide-react';
import { products, categories } from '../data/products';

const Categories = () => {
  const { category } = useParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filterPrice, setFilterPrice] = useState<[number, number]>([0, 50000]);
  const [filterRating, setFilterRating] = useState(0);

  const categoryInfo = categories.find(cat => cat.id === category);
  const categoryProducts = category === 'all' 
    ? products 
    : products.filter(product => product.category === category);

  const filteredProducts = categoryProducts
    .filter(product => 
      product.price >= filterPrice[0] && 
      product.price <= filterPrice[1] &&
      product.rating >= filterRating
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'name':
        default: return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-playfair font-bold text-amber-900 mb-4">
            {category === 'all' ? 'All Collections' : categoryInfo?.name || 'Category'}
          </h1>
          <p className="text-xl text-amber-700">
            {filteredProducts.length} handcrafted masterpieces
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 space-y-6">
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-amber-800 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    value={filterPrice[1]}
                    onChange={(e) => setFilterPrice([filterPrice[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-amber-600">
                    <span>₹0</span>
                    <span>₹{filterPrice[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-amber-800 mb-3">Minimum Rating</h4>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 0].map((rating) => (
                    <label key={rating} className="flex items-center custom-cursor">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filterRating === rating}
                        onChange={(e) => setFilterRating(parseFloat(e.target.value))}
                        className="mr-2 text-amber-600"
                      />
                      <div className="flex items-center">
                        {rating > 0 && (
                          <>
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
                            <span className="text-amber-700">{rating} & above</span>
                          </>
                        )}
                        {rating === 0 && <span className="text-amber-700">All ratings</span>}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-medium text-amber-800 mb-3">Categories</h4>
                <div className="space-y-2">
                  <Link
                    to="/category/all"
                    className={`block px-3 py-2 rounded-lg transition-colors custom-cursor ${
                      category === 'all' 
                        ? 'bg-amber-600 text-white' 
                        : 'text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    All Collections
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.id}`}
                      className={`block px-3 py-2 rounded-lg transition-colors custom-cursor ${
                        category === cat.id 
                          ? 'bg-amber-600 text-white' 
                          : 'text-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      {cat.name} ({cat.count})
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="glass-effect rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <SortAsc className="h-5 w-5 text-amber-600" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-amber-200 rounded-lg px-3 py-2 text-amber-800 custom-cursor"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors custom-cursor ${
                    viewMode === 'grid' 
                      ? 'bg-amber-600 text-white' 
                      : 'text-amber-600 hover:bg-amber-100'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors custom-cursor ${
                    viewMode === 'list' 
                      ? 'bg-amber-600 text-white' 
                      : 'text-amber-600 hover:bg-amber-100'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Products Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group glass-effect rounded-2xl overflow-hidden hover-lift custom-cursor"
                  style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Premium
                          </span>
                          </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-playfair font-semibold text-amber-900 mb-2 group-hover:text-amber-700 transition-colors">
                              {product.name}
                              </h3>
                              <p className="text-amber-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-amber-800">₹{product.price.toLocaleString()}</span>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                  <span className="text-sm text-amber-600">{product.rating}</span>
                                  </div>
                                  </div>
                                  <div className="mt-4 pt-4 border-t border-amber-200">
                                    <p className="text-xs text-amber-600">By {product.seller}</p>
                                    <p className="text-xs text-amber-500">{product.location}</p>
                                    </div>
                                    </div>
                                    </Link>
                                  ))}
                                  </div>
                                  ) : (
              <div className="space-y-6">
                {filteredProducts.map((product, index) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="group glass-effect rounded-2xl overflow-hidden hover-lift custom-cursor flex"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="w-64 flex-shrink-0 relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-playfair font-semibold text-amber-900 group-hover:text-amber-700 transition-colors">
                            {product.name}
                          </h3>
                          <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium ml-4">
                            Premium
                          </span>
                        </div>
                        <p className="text-amber-600 mb-4">{product.description}</p>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm text-amber-600">{product.rating}</span>
                          </div>
                          <span className="text-sm text-amber-500">In Stock: {product.inStock}</span>
                        </div>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-2xl font-bold text-amber-800">₹{product.price.toLocaleString()}</p>
                          <p className="text-xs text-amber-600">By {product.seller}</p>
                          <p className="text-xs text-amber-500">{product.location}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-amber-600 mb-4">No products found matching your criteria</p>
                <p className="text-amber-500">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;