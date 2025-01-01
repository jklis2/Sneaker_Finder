import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddToCartConfirmation from "./AddToCartConfirmation";
import { useAuth } from "../context/AuthContext";

interface ProductCardProps {
  _id: string;
  name: string;
  price: number;
  size?: "normal" | "small";
  imageUrl?: string;
}

export default function ProductCard({
  _id,
  name,
  price,
  size = "normal",
  imageUrl,
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, userData } = useAuth();

  const handleAddToCart = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (!isAuthenticated || !userData) {
        setError("Please log in to add items to cart");
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      // Log the request payload for debugging
      const payload = {
        userId: userData._id,
        productId: _id,
        name,
        price,
        quantity: 1,
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
        throw new Error(responseData.message || "Failed to add item to cart");
      }

      setShowConfirmation(true);
      setError("");
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to add item to cart");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetails = () => {
    navigate(`/product/${_id}`);
  };

  const containerClasses =
    size === "normal"
      ? "border border-gray-300 shadow-lg rounded-lg p-4 w-full sm:w-[300px] h-[450px] flex flex-col"
      : "border border-gray-300 shadow-lg rounded-lg p-3 w-full sm:w-[280px] h-[420px] flex flex-col";

  const imageContainerClasses =
    size === "normal"
      ? "h-52 w-full flex items-center justify-center bg-gray-100 rounded overflow-hidden"
      : "h-44 w-full flex items-center justify-center bg-gray-100 rounded overflow-hidden";

  return (
    <>
      <div className={containerClasses}>
        <div className={imageContainerClasses}>
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name}
              className="h-full w-full object-cover rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/icons/placeholder.svg';
              }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-200 rounded">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3
              className={`${
                size === "normal" ? "text-lg" : "text-base"
              } font-semibold mt-4 line-clamp-2`}
            >
              {name}
            </h3>
            <p className={`${size === "normal" ? "text-lg" : "text-base"} mt-2`}>
              ${price.toFixed(2)}
            </p>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          <div className="mt-auto">
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="flex-1 bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {isLoading ? "Adding..." : "Add to Cart"}
              </button>
              <button
                onClick={handleDetails}
                className="flex-1 border border-black text-black py-2 rounded hover:bg-gray-100 transition-colors"
              >
                Details
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
          }}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </>
  );
}
