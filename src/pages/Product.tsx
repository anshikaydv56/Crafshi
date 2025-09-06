// src/pages/Products.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  inStock: number;
  image: string;
  seller: string;
  location: string;
  description: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products'); // backend endpoint
        setProducts(res.data.products || []);   // adjust according to backend response
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-12">Loading products...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <Link
          key={product.id}
          to={`/product/${product.id}`}
          className="group glass-effect rounded-2xl overflow-hidden hover-lift"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="p-4">
            <h3 className="font-semibold text-amber-900 mb-2">{product.name}</h3>
            <p className="text-amber-800 font-bold">₹{product.price.toLocaleString()}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Products;
