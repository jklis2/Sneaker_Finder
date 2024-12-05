import { useState } from "react";
import AddToCartConfirmation from "./AddToCartConfirmation";

interface ProductInfoCompProps {
  id: string;
  name: string;
  price: number;
  retail: number;
}

export default function ProductInfoComp({
  id,
  name,
  price,
  retail,
}: ProductInfoCompProps) {
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      setError("");

      const userData = localStorage.getItem("userData");
      if (!userData) {
        setError("Please log in to add items to cart");
        return;
      }

      const { _id: userId } = JSON.parse(userData);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId,
          productId: id,
          name,
          price,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      setShowConfirmation(true);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Failed to add item to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">{name}</h2>
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-2xl font-bold">${price.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Retail price: ${retail.toFixed(2)}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <label htmlFor="quantity" className="text-gray-700">Quantity:</label>
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
          {isLoading ? "Adding to Cart..." : "Add to Cart"}
        </button>
      </div>

      {showConfirmation && (
        <AddToCartConfirmation
          item={{
            productId: id,
            name,
            price,
            quantity,
          }}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
}
