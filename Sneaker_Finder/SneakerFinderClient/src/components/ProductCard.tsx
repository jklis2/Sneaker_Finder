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
  const navigate = useNavigate();
  const { isAuthenticated, userData } = useAuth();

  const handleAddToCart = async () => {
    if (availableSizes && availableSizes.length > 0 && !selectedSize) {
      setError("Please select a size");
      return;
    }

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
      ? "border border-gray-300 shadow-lg rounded-lg p-3 w-[48%] md:w-[300px] h-[380px] md:h-[450px] flex flex-col"
      : "border border-gray-300 shadow-lg rounded-lg p-2 w-[48%] md:w-[280px] h-[350px] md:h-[420px] flex flex-col";

  const imageContainerClasses =
    size === "normal"
      ? "aspect-square w-full flex items-center justify-center rounded overflow-hidden"
      : "aspect-square w-full flex items-center justify-center rounded overflow-hidden";

  return (
    <>
      <div className={containerClasses}>
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
            <p className="text-lg md:text-xl font-bold mb-3">${price}</p>
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
                  <option value="">Select Size</option>
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
            size: selectedSize
          }}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </>
  );
}
