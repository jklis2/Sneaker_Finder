import { useState } from "react";

interface ProductCardProps {
  name: string;
  price: number;
  size?: "normal" | "small";
}

export default function ProductCard({
  name,
  price,
  size = "normal",
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userData")
        ? JSON.parse(localStorage.getItem("userData")!)._id
        : null;

      if (!userId) {
        alert("Please log in to add items to cart");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            productId: name.replace(/\s+/g, "-").toLowerCase(), // Using name as ID for now
            name,
            price,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      alert("Item added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const containerClasses =
    size === "normal"
      ? "border border-gray-300 shadow-lg rounded-lg p-4 w-1/4"
      : "border border-gray-300 shadow-lg rounded-lg p-3 w-1/5";

  const imageContainerClasses =
    size === "normal"
      ? "h-40 w-full flex items-center justify-center bg-red-500"
      : "h-32 w-full flex items-center justify-center bg-red-500";

  return (
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
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className={`mt-4 w-full bg-black hover:bg-gray-800 text-white font-bold ${
            size === "normal" ? "py-2 px-4" : "py-1.5 px-3"
          } rounded transition-colors duration-200`}
        >
          {isLoading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
