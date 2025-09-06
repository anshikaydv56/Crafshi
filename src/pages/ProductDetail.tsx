import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../config/api';
import { useCart, CartItem } from '../context/CartContext';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  rating?: number;
  inStock: number;
  seller: string;
  location: string;
  materials?: string[];
  dimensions?: string;
  weight?: string;
  technique?: string;
  yearMade?: string;
  story?: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/product/${id}`);
        setProduct(res.data.product);
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      seller: product.seller,
      location: product.location,
    };

    try {
      await addToCart(item);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Add to cart failed:', error);
      alert('Failed to add product to cart.');
    }
  };

  if (loading) return <div>Loading product...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-amber-900 mb-4">{product.name}</h1>
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-96 object-cover rounded-2xl mb-6"
      />
      <p className="text-amber-700 mb-4">{product.description}</p>
      <p className="text-amber-800 font-semibold">Price: ₹{product.price.toLocaleString()}</p>
      <p className="text-amber-800">Category: {product.category}</p>
      <p className="text-amber-800">Seller: {product.seller}</p>
      <p className="text-amber-800">Location: {product.location}</p>
      <p className="text-amber-800">In Stock: {product.inStock}</p>

      <div className="mt-4 flex items-center space-x-4">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-4 py-2 bg-amber-200 rounded"
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="px-4 py-2 bg-amber-200 rounded"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        className="mt-6 px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;
