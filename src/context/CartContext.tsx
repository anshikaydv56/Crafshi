import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api'; // Axios instance

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  seller: string;
  location: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  getCartTotal: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const fetchCart = async () => {
    try {
      const res = await api.get('/api/cart');
      setCartItems(res.data.items || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (item: CartItem) => {
    try {
      const exists = cartItems.find((i) => i.id === item.id);
      if (exists) {
        await updateQuantity(item.id, exists.quantity + item.quantity);
      } else {
        await api.post('/api/cart', item);
        setCartItems([...cartItems, item]);
      }
    } catch (error) {
      console.error('Add to cart failed:', error);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      await api.delete(`/api/cart/${id}`);
      setCartItems(cartItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Remove from cart failed:', error);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      await api.put(`/api/cart/${id}`, { quantity });
      setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
    } catch (error) {
      console.error('Update quantity failed:', error);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, getCartTotal, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
