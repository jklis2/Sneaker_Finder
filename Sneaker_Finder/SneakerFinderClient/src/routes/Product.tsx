import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductInfo from "../containers/ProductInfo";
import ProductPhotos from "../containers/ProductPhotos";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";
import ProductCard from "../components/ProductCard";
import Button from "../components/Button";

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
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSimilarProducts = async (currentProduct: Product) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products?brand=${currentProduct.brand}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch similar products");
      }

      const products = await response.json();
      const filtered = products
        .filter((p: Product) => p._id !== currentProduct._id)
        .slice(0, 4);
      
      setSimilarProducts(filtered);
    } catch (error) {
      console.error("Error fetching similar products:", error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        setProduct(data);
        await fetchSimilarProducts(data);
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
        
        {similarProducts.length > 0 && (
          <div className="mt-16 mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Similar Products</h2>
              <div className="w-48">
                <Button
                  name={`View All ${product.brand} Products`}
                  type="button"
                  onClick={() => navigate(`/${product.brand.toLowerCase().replace(/\s+/g, '-')}/products`)}
                  className="text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center">
              {similarProducts.map((product) => (
                <div key={product._id} className="flex justify-center w-full">
                  <ProductCard
                    _id={product._id}
                    name={product.name}
                    price={product.price}
                    imageUrl={product.imageUrl}
                    size="small"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}