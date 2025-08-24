import React, { createContext, useContext, useState } from 'react';
import { cartAPI } from '../config/api.js';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  seller: { name: string; location: string };
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  getCartTotal: () => number;
  clearCart: () => Promise<void>;
  loading: boolean;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get();
      const formattedItems = response.data.items.map(item => ({
        id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.images[0]?.url || '',
        seller: item.product.seller,
        quantity: item.quantity
      }));
      setCartItems(formattedItems);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async (productId: number, quantity = 1) => {
    setLoading(true);
    try {
      await cartAPI.add(productId, quantity);
      await fetchCart();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    setLoading(true);
    try {
      await cartAPI.remove(productId);
      await fetchCart();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    setLoading(true);
    try {
      await cartAPI.update(productId, quantity);
      await fetchCart();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await cartAPI.clear();
      setCartItems([]);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart on mount
  React.useEffect(() => {
    const token = localStorage.getItem('crafshi_token');
    if (token) {
      fetchCart();
    }
  }, []);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      clearCart,
      loading,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};