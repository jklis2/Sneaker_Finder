import { useState, useEffect } from "react";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartData {
  items: CartItem[];
  total: number;
}

export default function Cart() {
  const [cart, setCart] = useState<CartData>({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const userId = localStorage.getItem("userData")
        ? JSON.parse(localStorage.getItem("userData")!)._id
        : null;

      if (!userId) {
        setError("Please log in to view your cart");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to load cart");
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const userId = JSON.parse(localStorage.getItem("userData")!)._id;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart");
      }

      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Error updating cart:", error);
      alert("Failed to update cart");
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const userId = JSON.parse(localStorage.getItem("userData")!)._id;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item");
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        {cart.items.length === 0 ? (
          <div className="text-center text-gray-500">Your cart is empty</div>
        ) : (
          <div className="space-y-8">
            {cart.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded"></div>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-2 py-1 border rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-2 py-1 border rounded"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-xl">${cart.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-end">
              <button className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
