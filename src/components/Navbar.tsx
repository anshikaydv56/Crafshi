import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const categories = [
    'Pottery', 'Textiles', 'Jewelry', 'Woodwork', 'Metalcraft', 'Paintings'
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-amber-200/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <Sparkles className="h-10 w-10 text-amber-600" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-3xl font-bold font-playfair text-gradient">Crafshi</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-amber-800 hover:text-amber-100 font-medium transition-all duration-300 hover:scale-105 hover:bg-amber-800 p-2 rounded-md hover:shadow-md"
            >
              Home
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-amber-800 hover:text-amber-100 font-medium transition-all duration-300 hover:scale-105 hover:bg-amber-800 p-2 rounded-md hover:shadow-md">
                Collections
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 glass-effect rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="p-4 grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/category/${category.toLowerCase()}`}
                      className="block px-4 py-3 text-amber-700 hover:text-amber-100 hover:bg-amber-800 shadow-md rounded-lg transition-all duration-200"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          
            {/* ✅ About page link */}
            <Link 
            to="/about"
            className="text-amber-800 hover:text-amber-100 font-medium transition-all duration-300 hover:scale-105 hover:bg-amber-800 p-2 rounded-md hover:shadow-md"
            >
              About
              </Link>

            {/* ✅ Contact scroll button */}
            <a 
              href="#contact"
              className="text-amber-800 hover:text-amber-100 font-medium transition-all duration-300 hover:scale-105 hover:bg-amber-800 p-2 rounded-md hover:shadow-md"
            >
              Contact
            </a>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100/50 rounded-full transition-all duration-300 hover:scale-110"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100/50 rounded-full transition-all duration-300 hover:scale-110"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User Account */}
            {user ? (
              <div className="relative group">
                <button className="p-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100/50 rounded-full transition-all duration-300 hover:scale-110">
                  <User className="h-6 w-6" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 glass-effect rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-4">
                    <p className="text-amber-800 font-medium mb-2">Welcome, {user.name}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100/50 rounded-lg transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="p-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100/50 rounded-full transition-all duration-300 hover:scale-110"
              >
                <User className="h-6 w-6" />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100/50 rounded-full transition-all duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="pb-4 lg:pb-6">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search for handicrafts..."
                className="w-full px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-500" />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="space-y-2">
              <Link 
                to="/" 
                className="block px-4 py-3 text-amber-800 hover:text-amber-600 hover:bg-amber-100/50 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/category/${category.toLowerCase()}`}
                  className="block px-4 py-3 text-amber-800 hover:text-amber-600 hover:bg-amber-100/50 rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
              <Link 
                to="/about"
                className="block w-full text-left px-4 py-3 text-amber-800 hover:text-amber-600 hover:bg-amber-100/50 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <a 
                href="#contact"
                className="block w-full text-left px-4 py-3 text-amber-800 hover:text-amber-600 hover:bg-amber-100/50 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
