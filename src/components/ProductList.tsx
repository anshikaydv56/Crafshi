import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../config/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data.data || res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => (
        <Link
          to={`/product/${p._id}`}
          key={p._id}
          className="p-4 border rounded-lg hover:shadow-md transition"
        >
          {p.image && <img src={p.image} alt={p.name} className="w-full h-48 object-cover mb-2 rounded" />}
          <h3 className="font-semibold text-lg">{p.name}</h3>
          <p className="text-amber-700 font-bold">₹{p.price.toLocaleString()}</p>
          <p className="text-gray-600 text-sm">{p.description}</p>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
