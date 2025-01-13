import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import H1 from "../components/H1";
import ProductCard from "../components/ProductCard";

interface PromotionProduct {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  availableSizes: string[];
}

export default function Promotions() {
  const { t } = useTranslation('home');
  const [products, setProducts] = useState<PromotionProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setIsLoading(true);
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/products`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch promotional products");
        }

        const data = await response.json();
        // Randomly shuffle the array and take 8 items
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 8));
      } catch (err) {
        console.error("[Promotions] Error fetching products:", err);
        setError("Failed to load promotional products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-10">
        <h2 className="text-xl font-bold mb-2">{t('promotions.error')}</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <H1 className="px-12 mt-32">{t('promotions.title')}</H1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 min-[1260px]:grid-cols-4 gap-4 w-full max-w-[1280px] mx-auto px-2 justify-items-center">
        {products.map(product => (
          <ProductCard
            key={product._id}
            _id={product._id}
            name={product.name}
            price={product.price}
            imageUrl={product.imageUrl}
            size="normal"
            availableSizes={product.availableSizes}
          />
        ))}
      </div>
    </>
  );
}
