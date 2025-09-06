import React, { useState, useEffect } from "react";
import { Grid, List } from "lucide-react";
import api from "../config/api";
import { Link } from "react-router-dom";

// 👇 Product type same as Product.tsx
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  inStock: number;
}

const Categories: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<string>("none");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/products");
        setProducts(res.data.products);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Filter products
  const categoryProducts: Product[] =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  // ✅ Sort products
  const sortedProducts = [...categoryProducts].sort((a, b) => {
    if (sort === "low-to-high") return a.price - b.price;
    if (sort === "high-to-low") return b.price - a.price;
    return 0;
  });

  if (loading) return <div className="text-center py-20">Loading products...</div>;

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        {/* Category filter */}
        <select
          value={category}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setCategory(e.target.value)
          }
          className="border px-4 py-2 rounded-lg"
        >
          <option value="all">All</option>
          <option value="home">Home</option>
          <option value="fashion">Fashion</option>
          <option value="decor">Decor</option>
        </select>

        {/* Sort dropdown */}
        <select
          value={sort}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSort(e.target.value)
          }
          className="border px-4 py-2 rounded-lg"
        >
          <option value="none">Default</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>

        {/* View toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg ${
              view === "grid" ? "bg-amber-600 text-white" : "bg-gray-200"
            }`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg ${
              view === "list" ? "bg-amber-600 text-white" : "bg-gray-200"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Products */}
      <div
        className={
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {sortedProducts.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="glass-effect rounded-xl p-4 shadow hover-lift flex gap-4"
          >
            <img
              src={product.image}
              alt={product.name}
              className={`${
                view === "grid" ? "w-full h-40" : "w-32 h-32"
              } object-cover rounded-lg`}
            />
            <div>
              <h3 className="font-semibold text-amber-900">{product.name}</h3>
              <p className="text-sm text-gray-600 capitalize">
                {product.category}
              </p>
              <p className="font-bold text-amber-700">₹{product.price}</p>
              <p className="text-xs text-gray-500">
                ⭐ {product.rating} | {product.inStock} left
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
