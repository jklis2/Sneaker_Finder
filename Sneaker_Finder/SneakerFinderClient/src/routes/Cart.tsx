import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  size?: string;
}

interface CartData {
  items: CartItem[];
  total: number;
}

export default function Cart() {
  const navigate = useNavigate();
  const { userData, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartData>({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { addItem, removeItem: removeContextItem, clearItems } = useCart();

  const fetchProductDetails = async (productId: string): Promise<Product | null> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${productId}`
      );
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Error fetching product details:", error);
      return null;
    }
  };

  useEffect(() => {
    if (isAuthenticated && userData) {
      fetchCart();
    } else {
      setError("Please log in to view your cart");
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userData]);

  const fetchCart = async () => {
    try {
      if (!userData?._id) {
        throw new Error("User ID not found");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart?userId=${userData._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch cart");
      }

      const data: CartData = await response.json();
      
      // Fetch product details for each item
      const itemsWithDetails = await Promise.all(
        data.items.map(async (item) => {
          const product = await fetchProductDetails(item.productId);
          return {
            ...item,
            imageUrl: product?.imageUrl
          };
        })
      );

      setCart({ ...data, items: itemsWithDetails });

      if (data.items) {
        clearItems();
        data.items.forEach((item: CartItem) => {
          for (let i = 0; i < item.quantity; i++) {
            addItem(item.productId);
          }
        });
      }

      setError("");
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError(error instanceof Error ? error.message : "Failed to load cart");
      setCart({ items: [], total: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (!userData?._id) {
        throw new Error("User ID not found");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const currentItem = cart.items.find((item) => item.productId === productId);
      const currentQuantity = currentItem ? currentItem.quantity : 0;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: userData._id,
            productId,
            quantity,
            size: cart.items.find(item => item.productId === productId)?.size
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update cart");
      }

      const data: CartData = await response.json();
      setCart(data);

      if (quantity > currentQuantity) {
        for (let i = 0; i < quantity - currentQuantity; i++) {
          addItem(productId);
        }
      } else if (quantity < currentQuantity) {
        for (let i = 0; i < currentQuantity - quantity; i++) {
          removeContextItem(productId);
        }
      }

      setError("");
    } catch (error) {
      console.error("Error updating cart:", error);
      setError(error instanceof Error ? error.message : "Failed to update cart");
    }
  };

  const removeItem = async (productId: string) => {
    try {
      if (!userData?._id) {
        throw new Error("User ID not found");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const currentItem = cart.items.find((item) => item.productId === productId);
      const currentQuantity = currentItem ? currentItem.quantity : 0;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart/remove`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: userData._id,
            productId,
            size: cart.items.find(item => item.productId === productId)?.size
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to remove item");
      }

      const data: CartData = await response.json();
      setCart(data);

      for (let i = 0; i < currentQuantity; i++) {
        removeContextItem(productId);
      }

      setError("");
    } catch (error) {
      console.error("Error removing item:", error);
      setError(error instanceof Error ? error.message : "Failed to remove item");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">Loading cart...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        {error ? (
          <div className="text-red-500 text-center mb-4">{error}</div>
        ) : cart.items.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate("/")}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {cart.items.map((item: CartItem) => (
              <div
                key={item.productId}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={item.imageUrl || "/images/placeholder.png"}
                      alt={item.name}
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                    {item.size && (
                      <p className="text-gray-500 text-sm">Size: {item.size}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded">
                    <button
                      className="px-3 py-1 border-r hover:bg-gray-100"
                      onClick={() =>
                        updateQuantity(item.productId, Math.max(0, item.quantity - 1))
                      }
                    >
                      -
                    </button>
                    <span className="px-4 py-1">{item.quantity}</span>
                    <button
                      className="px-3 py-1 border-l hover:bg-gray-100"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
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
            <div className="text-right text-xl font-bold">
              Total: ${cart.total.toFixed(2)}
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
