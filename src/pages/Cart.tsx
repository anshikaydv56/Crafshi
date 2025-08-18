import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Implement checkout logic
    alert('Checkout functionality coming soon!');
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-effect rounded-2xl p-12">
            <ShoppingBag className="h-24 w-24 text-amber-300 mx-auto mb-6" />
            <h1 className="text-3xl font-playfair font-bold text-amber-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-xl text-amber-700 mb-8">
              Discover our beautiful handcrafted items
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-full hover:from-amber-700 hover:to-orange-700 transition-all duration-300 hover:scale-105 custom-cursor"
            >
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-playfair font-bold text-amber-900 mb-8">
          Shopping Cart ({cartItems.length} items)
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="glass-effect rounded-2xl p-6 hover-lift">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full sm:w-32 h-32 object-cover rounded-xl"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <Link 
                        to={`/product/${item.id}`}
                        className="text-xl font-playfair font-semibold text-amber-900 hover:text-amber-700 transition-colors custom-cursor"
                      >
                        {item.name}
                      </Link>
                      <p className="text-amber-600 text-sm mt-1">By {item.seller}</p>
                      <p className="text-amber-500 text-sm">{item.location}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-amber-700">Quantity:</span>
                        <div className="flex items-center border-2 border-amber-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="p-2 text-amber-600 hover:bg-amber-50 custom-cursor"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 text-amber-800 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-amber-600 hover:bg-amber-50 custom-cursor"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end space-x-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-amber-800">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-sm text-amber-600">
                            ₹{item.price.toLocaleString()} each
                          </p>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors custom-cursor"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="glass-effect rounded-2xl p-6 sticky top-24">
              <h2 className="text-2xl font-playfair font-bold text-amber-900 mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-amber-700">Subtotal</span>
                  <span className="text-amber-800 font-medium">
                    ₹{getCartTotal().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Tax</span>
                  <span className="text-amber-800 font-medium">
                    ₹{Math.round(getCartTotal() * 0.18).toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-amber-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold text-amber-900">Total</span>
                    <span className="text-2xl font-bold text-amber-800">
                      ₹{Math.round(getCartTotal() * 1.18).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 px-6 rounded-full font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 hover:scale-105 custom-cursor flex items-center justify-center"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>

              <div className="mt-6 space-y-3 text-sm text-amber-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Free shipping on orders above ₹10,000</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>7-day return policy</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 border-2 border-amber-600 text-amber-600 font-semibold rounded-full hover:bg-amber-600 hover:text-white transition-all duration-300 hover:scale-105 custom-cursor"
              >
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;