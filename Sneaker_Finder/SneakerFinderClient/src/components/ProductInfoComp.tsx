import { useState } from "react";
import { useTranslation } from "react-i18next";
import AddToCartConfirmation from "./AddToCartConfirmation";
import { useAuth } from "../context/AuthContext";

interface ProductInfoCompProps {
  id: string;
  name: string;
  price: number;
  retail: number;
  brand: string;
  availableSizes?: string[];
  color?: string;
}

export default function ProductInfoComp({
  id,
  name,
  price,
  retail,
  brand,
  availableSizes,
  color,
}: ProductInfoCompProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated, userData } = useAuth();
  const { t } = useTranslation('product');

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!isAuthenticated || !userData) {
        setError(t('productInfo.errors.loginRequired'));
        return;
      }

      if (availableSizes && availableSizes.length > 0 && !selectedSize) {
        setError(t('productInfo.errors.sizeRequired'));
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError(t('productInfo.errors.authTokenMissing'));
        return;
      }

      // Log the request payload for debugging
      const payload = {
        userId: userData._id,
        productId: id,
        name,
        price,
        quantity,
        size: selectedSize,
      };
      console.log('Adding to cart with payload:', payload);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log('Server response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || t('productInfo.errors.addToCartFailed'));
      }

      setShowConfirmation(true);
      setError("");
    } catch (err) {
      console.error("Error adding to cart:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('productInfo.errors.addToCartFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-1">{name}</h2>
      <p className="text-gray-600 mb-4">{brand}</p>
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-2xl font-bold">${price.toFixed(2)}</p>
          <p className="text-sm text-gray-500">{t('productInfo.retailPrice')}: ${retail.toFixed(2)}</p>
        </div>

        {color && (
          <div>
            <p className="text-sm text-gray-600">{t('productInfo.color')}: {color}</p>
          </div>
        )}

        {availableSizes && availableSizes.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">{t('productInfo.selectSize')}</p>
            <div className="grid grid-cols-3 gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setError("");
                  }}
                  className={`text-center border rounded py-2 text-sm transition-colors duration-200 ${
                    selectedSize === size 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-4">
          <label htmlFor="quantity" className="text-gray-700">{t('productInfo.quantity')}:</label>
          <div className="flex items-center border rounded">
            <button
              className="px-3 py-1 border-r hover:bg-gray-100"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <span className="px-4 py-1">{quantity}</span>
            <button
              className="px-3 py-1 border-l hover:bg-gray-100"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? t('productInfo.addingToCart') : t('productInfo.addToCart')}
        </button>
      </div>

      {showConfirmation && (
        <AddToCartConfirmation
          item={{
            productId: id,
            name,
            price,
            quantity,
            size: selectedSize,
          }}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
}
