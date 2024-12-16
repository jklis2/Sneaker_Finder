import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductInfo from "../containers/ProductInfo";
import ProductPhotos from "../containers/ProductPhotos";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";

interface Product {
  _id: string;
  name: string;
  price: number;
  retail: number;
  brand: string;
  availableSizes: string[];
  color: string;
  imageUrl?: string;
}

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/product/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        console.log('Product data from API:', data);  // Debug log
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500 text-xl">{error || "Product not found"}</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <ProductPhotos name={product.name} imageUrl={product.imageUrl} />
          <ProductInfo 
            id={product._id} 
            name={product.name} 
            price={product.price}
            retail={product.retail}
            brand={product.brand}
            availableSizes={product.availableSizes}
            color={product.color}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
}