import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

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

const shippingMethods: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    price: 4.99,
    estimatedDays: "3-5 business days",
  },
  {
    id: "express",
    name: "Express Shipping",
    price: 14.99,
    estimatedDays: "1-2 business days",
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    price: 29.99,
    estimatedDays: "Next business day",
  },
];

const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: "",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: "",
  },
  {
    id: "applepay",
    name: "Apple Pay",
    icon: "",
  },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [cart, setCart] = useState<CartData>({ items: [], total: 0 });

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });
  const [selectedShipping, setSelectedShipping] = useState(shippingMethods[0].id);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);

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
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userData = localStorage.getItem("userData");
      if (!userData) {
        throw new Error("Please log in to complete checkout");
      }

      const { _id: userId } = JSON.parse(userData);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId,
          shippingDetails: {
            ...formData,
            shippingMethod: selectedShipping,
          },
          paymentMethod: selectedPayment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      // Clear cart and redirect to order confirmation
      navigate("/order-confirmation");
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Failed to process checkout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <section className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="apartment" className="block text-sm font-medium text-gray-700">
                      Apartment, suite, etc. (optional)
                    </label>
                    <input
                      type="text"
                      id="apartment"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                      />
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Method */}
              <section className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
                <div className="space-y-4">
                  {shippingMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedShipping === method.id
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={method.id}
                          checked={selectedShipping === method.id}
                          onChange={(e) => setSelectedShipping(e.target.value)}
                          className="h-4 w-4 text-black focus:ring-black border-gray-300"
                        />
                        <div className="ml-4">
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-gray-500">{method.estimatedDays}</div>
                        </div>
                      </div>
                      <div className="font-medium">${method.price.toFixed(2)}</div>
                    </label>
                  ))}
                </div>
              </section>

              {/* Payment Method */}
              <section className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPayment === method.id
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300"
                      />
                      <span className="ml-2">{method.icon}</span>
                      <span className="ml-2">{method.name}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {isLoading ? "Processing..." : "Place Order"}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4 mb-4">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                    </div>
                    <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shippingMethods.find((m) => m.id === selectedShipping)?.price.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>
                    ${(cart.total + (shippingMethods.find((m) => m.id === selectedShipping)?.price || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
