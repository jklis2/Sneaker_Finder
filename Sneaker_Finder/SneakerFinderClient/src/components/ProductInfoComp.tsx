import { useState } from "react";
import AddToCartConfirmation from "./AddToCartConfirmation";
import { useAuth } from "../context/AuthContext";

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
  const { isAuthenticated, userData } = useAuth();

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      setError("");

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
        productId: id,
        name,
        price,
        quantity,
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
        throw new Error(responseData.message || "Failed to add item to cart");
      }

      setShowConfirmation(true);
      setError("");
    } catch (err) {
      console.error("Error adding to cart:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to add item to cart. Please try again.");
      }
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

        <div className="text-xs text-gray-500">
          Product ID: {id}
        </div>
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
