import { useState, useEffect } from "react";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import ProductCard from "../components/ProductCard";

interface StockXProduct {
  _id: string;
  name: string;
  price: number;
}

export default function AllProducts() {
  const [products, setProducts] = useState<StockXProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/product`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-center">All Products</h1>
        {products.length === 0 ? (
          <div className="text-center text-gray-500">No products found</div>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center max-w-7xl">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                name={product.name}
                price={product.price}
                size="small"
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
