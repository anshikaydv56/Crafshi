import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    alert('Checkout functionality coming soon!');
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-effect rounded-2xl p-12">
            <ShoppingBag className="h-24 w-24 text-amber-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-amber-900 mb-4">Your cart is empty</h1>
            <p className="text-xl text-amber-700 mb-8">Discover our beautiful handcrafted items</p>
            <Link
              to="/"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-full hover:scale-105"
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
    <div className="pt-24 pb-12 max-w-6xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-amber-900 mb-8">Shopping Cart ({cartItems.length} items)</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="glass-effect rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full sm:w-32 h-32 object-cover rounded-xl"
                />
                <div className="flex-1 space-y-4">
                  <Link
                    to={`/product/${item.id}`}
                    className="text-xl font-semibold text-amber-900 hover:text-amber-700"
                  >
                    {item.name}
                  </Link>
                  <p className="text-amber-600 text-sm">By {item.seller}</p>
                  <p className="text-amber-600 text-sm">{item.location}</p>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="p-2 text-amber-600"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-amber-600"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <p className="text-amber-800 font-bold">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="glass-effect rounded-2xl p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t border-amber-200 pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>₹{Math.round(getCartTotal() * 1.18).toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-semibold"
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
