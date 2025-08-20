import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Sparkles className="h-10 w-10 text-amber-300" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-3xl font-bold font-playfair text-amber-100">Crafshi</span>
            </div>
            <p className="text-amber-200 leading-relaxed">
              Preserving India's rich heritage through authentic handicrafts. 
              Each piece tells a story of tradition, skill, and cultural pride.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-amber-800 rounded-full hover:bg-amber-700 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-amber-800 rounded-full hover:bg-amber-700 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-amber-800 rounded-full hover:bg-amber-700 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-amber-800 rounded-full hover:bg-amber-700 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-playfair font-bold text-amber-100">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-amber-200 hover:text-amber-100 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/category/all" className="text-amber-200 hover:text-amber-100 transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-amber-200 hover:text-amber-100 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                {/* Scrolls to footer contact */}
                <a href="#contact" className="text-amber-200 hover:text-amber-100 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <Link to="/artisans" className="text-amber-200 hover:text-amber-100 transition-colors">
                  Our Artisans
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-xl font-playfair font-bold text-amber-100">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/category/pottery" className="text-amber-200 hover:text-amber-100 transition-colors">
                  Pottery
                </Link>
              </li>
              <li>
                <Link to="/category/textiles" className="text-amber-200 hover:text-amber-100 transition-colors">
                  Textiles
                </Link>
              </li>
              <li>
                <Link to="/category/jewelry" className="text-amber-200 hover:text-amber-100 transition-colors">
                  Jewelry
                </Link>
              </li>
              <li>
                <Link to="/category/woodwork" className="text-amber-200 hover:text-amber-100 transition-colors">
                  Woodwork
                </Link>
              </li>
              <li>
                <Link to="/category/metalcraft" className="text-amber-200 hover:text-amber-100 transition-colors">
                  Metalcraft
                </Link>
              </li>
              <li>
                <Link to="/category/paintings" className="text-amber-200 hover:text-amber-100 transition-colors">
                  Paintings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6" id="contact">
            <h3 className="text-xl font-playfair font-bold text-amber-100">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-300 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-amber-200">
                    123 Heritage Street<br />
                    Craft District, New Delhi<br />
                    India - 110001
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-300 flex-shrink-0" />
                <p className="text-amber-200">+91 98765 43210</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-amber-300 flex-shrink-0" />
                <p className="text-amber-200">hello@crafshi.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-amber-700">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-playfair font-bold text-amber-100 mb-2">
                Stay Connected
              </h3>
              <p className="text-amber-200">
                Subscribe to our newsletter for exclusive offers and new arrivals
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-amber-800 border border-amber-600 text-white placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-amber-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-amber-200 text-sm">
              © 2024 Crafshi. All rights reserved. Made with ❤️ for Indian Heritage.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-amber-200 hover:text-amber-100 transition-colors">
                Privacy Policy
              </Link>  
              <Link to="/terms" className="text-amber-200 hover:text-amber-100 transition-colors">
                Terms of Service
              </Link>
              <Link to="/shipping" className="text-amber-200 hover:text-amber-100 transition-colors">
                Shipping Info
              </Link>
              <Link to="/returns" className="text-amber-200 hover:text-amber-100 transition-colors">
                Returns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
