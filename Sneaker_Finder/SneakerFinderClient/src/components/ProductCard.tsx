import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddToCartConfirmation from "./AddToCartConfirmation";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

interface ProductCardProps {
  _id: string;
  name: string;
  price: number;
  size?: "normal" | "small";
  imageUrl?: string;
  availableSizes?: string[];
}

export default function ProductCard({
  _id,
  name,
  price,
  size = "normal",
  imageUrl,
  availableSizes = [],
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, userData } = useAuth();
  const { t } = useTranslation('allProducts');
  const isAdmin = userData?.role === 'admin';

  const handleAddToCart = async () => {
    if (availableSizes && availableSizes.length > 0 && !selectedSize) {
      setError(t('error.selectSize'));
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      if (!isAuthenticated || !userData) {
        setError(t('error.loginToAddToCart'));
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError(t('error.authenticationTokenNotFound'));
        return;
      }

      const payload = {
        userId: userData._id,
        productId: _id,
        name,
        price,
        quantity: 1,
        size: selectedSize,
      };
      console.log('Adding to cart with payload:', payload);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();
      console.log('Server response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || t('error.failedToAddToCart'));
      }

      setShowConfirmation(true);
      setError("");
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(t('error.failedToAddToCart'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetails = () => {
    navigate(`/product/${_id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/admin/edit-product/${_id}`);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      window.location.reload();
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product');
    }
  };

  const containerClasses =
    size === "normal"
      ? "border border-gray-300 shadow-lg rounded-lg p-3 w-[48%] md:w-[300px] h-[380px] md:h-[450px] flex flex-col relative"
      : "border border-gray-300 shadow-lg rounded-lg p-2 w-[48%] md:w-[280px] h-[350px] md:h-[420px] flex flex-col relative";

  const imageContainerClasses =
    size === "normal"
      ? "aspect-square w-full flex items-center justify-center rounded overflow-hidden"
      : "aspect-square w-full flex items-center justify-center rounded overflow-hidden";

  return (
    <>
      <div className={containerClasses}>
        {isAdmin && (
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={handleEditClick}
              className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="absolute top-2 right-12 z-10 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        )}
        <div className={imageContainerClasses}>
          <img
            src={imageUrl || "/images/placeholder.png"}
            alt={name}
            className="w-full h-full object-contain p-2"
          />
        </div>
        <div className="flex-grow flex flex-col justify-between mt-4">
          <h3 className="text-sm md:text-base font-semibold line-clamp-2 mb-2">
            {name}
          </h3>
          <div className="mt-auto">
            <p className="text-lg md:text-xl font-bold mb-3">
              {price} {t('product.currency')}
            </p>
            {availableSizes && availableSizes.length > 0 && (
              <div className="mb-3">
                <select
                  value={selectedSize}
                  onChange={(e) => {
                    setSelectedSize(e.target.value);
                    setError("");
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="">{t('product.selectSize')}</option>
                  {availableSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {error && (
              <p className="text-red-500 text-sm mb-2">{error}</p>
            )}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="flex-1 bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {isLoading ? t('product.adding') : t('product.addToCart')}
              </button>
              <button
                onClick={handleDetails}
                className="flex-1 border border-black text-black py-2 rounded hover:bg-gray-100 transition-colors"
              >
                {t('product.details')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <AddToCartConfirmation
          item={{
            productId: _id,
            name,
            price,
            quantity: 1,
            size: selectedSize
          }}
          onClose={() => setShowConfirmation(false)}
        />
      )}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Product</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowDeleteConfirmation(false);
                }}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
