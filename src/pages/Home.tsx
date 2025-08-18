import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, ArrowRight } from 'lucide-react';
import { products } from '../data/products';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroImages = [
    'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg',
    'https://images.pexels.com/photos/8832878/pexels-photo-8832878.jpeg',
    'https://images.pexels.com/photos/1090641/pexels-photo-1090641.jpeg',
    'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg',
    'https://images.pexels.com/photos/1119799/pexels-photo-1119799.jpeg'
  ];

  const categories = [
    { name: 'Pottery', image: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg', count: products.filter(p => p.category === 'pottery').length },
    { name: 'Textiles', image: 'https://images.pexels.com/photos/8832878/pexels-photo-8832878.jpeg', count: products.filter(p => p.category === 'textiles').length },
    { name: 'Jewelry', image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg', count: products.filter(p => p.category === 'jewelry').length },
    { name: 'Woodwork', image: 'https://images.pexels.com/photos/1090644/pexels-photo-1090644.jpeg', count: products.filter(p => p.category === 'woodwork').length },
    { name: 'Metalcraft', image: 'https://images.pexels.com/photos/4792489/pexels-photo-4792489.jpeg', count: products.filter(p => p.category === 'metalcraft').length },
    { name: 'Paintings', image: 'https://images.pexels.com/photos/1119799/pexels-photo-1119799.jpeg', count: products.filter(p => p.category === 'paintings').length }
  ];

  const featuredProducts = products.slice(0, 8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="pt-20">
      {/* Hero Section - Photo Exhibition */}
      <section className="relative h-screen overflow-hidden">
        <div className="relative w-full h-full">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Handicraft ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-8 top-1/2 transform -translate-y-1/2 p-4 glass-effect rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 p-4 glass-effect rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>

          {/* Overlay Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-8">
              <h1 className="text-6xl lg:text-8xl font-playfair font-bold mb-6 animate-fade-in-up">
                Crafshi
              </h1>
              <p className="text-2xl lg:text-3xl font-light mb-8 animate-fade-in-up animation-delay-300">
                Where Art Meets Tradition
              </p>
              <div className="h-1 w-32 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto animate-fade-in-up animation-delay-600"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-amber-900 mb-4">
              Discover Our Collections
            </h2>
            <p className="text-xl text-amber-700 max-w-3xl mx-auto">
              Each piece tells a story of craftsmanship passed down through generations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-2xl hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-w-16 aspect-h-12 relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="category-overlay absolute inset-0 bg-amber-600/30"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-playfair font-bold mb-2">{category.name}</h3>
                  <p className="text-amber-100">{category.count} unique pieces</p>
                  <div className="mt-3 flex items-center text-amber-200 group-hover:text-white transition-colors">
                    <span className="mr-2">Explore Collection</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50/50 to-orange-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-amber-900 mb-4">
              Featured Masterpieces
            </h2>
            <p className="text-xl text-amber-700 max-w-3xl mx-auto">
              Handpicked exceptional pieces from our finest artisans
            </p>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product, index) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group glass-effect rounded-2xl overflow-hidden hover-lift"
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

          <div className="text-center mt-12">
            <Link
              to="/category/all"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-full hover:from-amber-700 hover:to-orange-700 transition-all duration-300 hover:scale-105"
            >
              View All Collections
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-amber-900 mb-6">
                The Art of Tradition
              </h2>
              <p className="text-lg text-amber-700 mb-6 leading-relaxed">
                Every piece in our collection represents centuries of skill, passed down through generations 
                of master craftsmen. From the pottery wheels of ancient villages to the intricate 
                metalwork of skilled artisans, each item carries within it the soul of its creator.
              </p>
              <p className="text-lg text-amber-700 mb-8 leading-relaxed">
                We believe in preserving these traditional arts while supporting the communities 
                that keep them alive. When you purchase from Crafshi, you're not just buying a product—you're 
                becoming part of a story that spans generations.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center px-6 py-3 border-2 border-amber-600 text-amber-600 font-semibold rounded-full hover:bg-amber-600 hover:text-white transition-all duration-300 hover:scale-105"
              >
                Learn More About Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/5797999/pexels-photo-5797999.jpeg"
                alt="Artisan at work"
                className="w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 glass-effect p-6 rounded-xl">
                <p className="text-2xl font-bold text-amber-900">50+</p>
                <p className="text-amber-700">Master Artisans</p>
              </div>
              <div className="absolute -top-6 -right-6 glass-effect p-6 rounded-xl">
                <p className="text-2xl font-bold text-amber-900">1000+</p>
                <p className="text-amber-700">Unique Pieces</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;