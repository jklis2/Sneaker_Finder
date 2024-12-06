import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddToCartConfirmation from "./AddToCartConfirmation";

interface ProductCardProps {
  _id: string;
  name: string;
  price: number;
  size?: "normal" | "small";
}

export default function ProductCard({
  _id,
  name,
  price,
  size = "normal",
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    setIsLoading(true);
    setError("");
    try {
      const userData = localStorage.getItem("userData");
      if (!userData) {
        setError("Please log in to add items to cart");
        return;
      }

      const { _id: userId } = JSON.parse(userData);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            userId,
            productId: _id,
            name,
            price,
            quantity: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      setShowConfirmation(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError("Failed to add item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetails = () => {
    navigate(`/product/${_id}`);
  };

  const containerClasses =
    size === "normal"
      ? "border border-gray-300 shadow-lg rounded-lg p-4 w-full sm:w-[300px]"
      : "border border-gray-300 shadow-lg rounded-lg p-3 w-full sm:w-[280px]";

  const imageContainerClasses =
    size === "normal"
      ? "h-40 w-full flex items-center justify-center bg-red-500"
      : "h-32 w-full flex items-center justify-center bg-red-500";

  return (
    <>
      <div className={containerClasses}>
        <div className={imageContainerClasses}>
          {/* Placeholder for the image */}
          <span className="text-white text-xs uppercase">Image placeholder</span>
        </div>
        <div className="mt-4">
          <h3
            className={`${
              size === "normal" ? "text-lg" : "text-base"
            } font-semibold`}
          >
            {name}
          </h3>
          <p className={`${size === "normal" ? "text-lg" : "text-base"}`}>
            ${price.toFixed(2)}
          </p>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className={`flex-1 ${
                size === "normal" ? "py-2 px-4" : "py-1.5 px-3"
              } bg-black hover:bg-gray-800 text-white font-bold rounded transition-colors duration-200 disabled:bg-gray-400`}
            >
              {isLoading ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={handleDetails}
              className={`flex-1 ${
                size === "normal" ? "py-2 px-4" : "py-1.5 px-3"
              } border border-black hover:bg-gray-100 font-bold rounded transition-colors duration-200`}
            >
              Details
            </button>
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
