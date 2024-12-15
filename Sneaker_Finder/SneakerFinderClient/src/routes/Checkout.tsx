import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import { useAuth } from "../context/AuthContext";
import { getShippingAddresses } from "../services/userService";

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

interface ShippingAddress {
  street: string;
  number: string;
  apartmentNumber?: string;
  city: string;
  province: string;
  postalCode: string;
  phoneNumber: string;
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
  const { isAuthenticated, userData } = useAuth();
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

  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  useEffect(() => {
    if (isAuthenticated && userData) {
      fetchCart();
      fetchSavedAddresses();
      // Pre-fill form data with user information
      setFormData(prev => ({
        ...prev,
        email: userData.email || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userData]);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!isAuthenticated || !userData?._id) {
        throw new Error("Please log in to view your cart");
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart?userId=${userData._id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch cart");
      }

      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError(error instanceof Error ? error.message : "Failed to load cart");
      if (error instanceof Error && error.message.includes("Please log in")) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedAddresses = async () => {
    try {
      const addresses = await getShippingAddresses();
      setSavedAddresses(addresses);
      if (addresses.length > 0) {
        setSelectedAddressIndex(0);
        const firstAddress = addresses[0];
        setFormData(prev => ({
          ...prev,
          address: firstAddress.street + " " + firstAddress.number,
          apartment: firstAddress.apartmentNumber || "",
          city: firstAddress.city,
          state: firstAddress.province,
          zipCode: firstAddress.postalCode,
          phone: firstAddress.phoneNumber,
        }));
      } else {
        setIsAddingNewAddress(true);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setError("Failed to load saved addresses");
    }
  };

  const handleAddressSelect = (index: number) => {
    setSelectedAddressIndex(index);
    const selectedAddress = savedAddresses[index];
    setFormData(prev => ({
      ...prev,
      address: selectedAddress.street + " " + selectedAddress.number,
      apartment: selectedAddress.apartmentNumber || "",
      city: selectedAddress.city,
      state: selectedAddress.province,
      zipCode: selectedAddress.postalCode,
      phone: selectedAddress.phoneNumber,
    }));
    setIsAddingNewAddress(false);
  };

  const handleAddNewAddress = () => {
    setSelectedAddressIndex(null);
    setIsAddingNewAddress(true);
    setFormData(prev => ({
      ...prev,
      address: "",
      apartment: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!isAuthenticated || !userData?._id) {
        throw new Error("Please log in to complete checkout");
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Create Stripe checkout session
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout/create-checkout-session?userId=${userData._id}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create checkout session");
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      setError(error instanceof Error ? error.message : "Failed to process checkout");
      if (error instanceof Error && error.message.includes("Please log in")) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">Loading checkout...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center text-red-500">{error}</div>
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Go to Login
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Checkout</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Email"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Shipping Address Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                
                {savedAddresses.length > 0 && (
                  <div className="mb-6">
                    <div className="grid grid-cols-1 gap-4">
                      {savedAddresses.map((address, index) => (
                        <div
                          key={index}
                          className={`border p-4 rounded-lg cursor-pointer ${
                            selectedAddressIndex === index ? 'border-black' : 'border-gray-200'
                          }`}
                          onClick={() => handleAddressSelect(index)}
                        >
                          <p className="font-medium">{address.street} {address.number}</p>
                          {address.apartmentNumber && <p className="text-gray-600">Apt {address.apartmentNumber}</p>}
                          <p className="text-gray-600">{address.city}, {address.province} {address.postalCode}</p>
                          <p className="text-gray-600">{address.phoneNumber}</p>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleAddNewAddress}
                      className="mt-4 text-black underline hover:text-gray-700"
                    >
                      Add New Address
                    </button>
                  </div>
                )}

                {(isAddingNewAddress || savedAddresses.length === 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="Street Address"
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={formData.apartment}
                        onChange={(e) =>
                          setFormData({ ...formData, apartment: e.target.value })
                        }
                        placeholder="Apartment, suite, etc. (optional)"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        placeholder="City"
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        placeholder="State/Province"
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) =>
                          setFormData({ ...formData, zipCode: e.target.value })
                        }
                        placeholder="ZIP/Postal Code"
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="Phone"
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="First Name"
                    required
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Last Name"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Shipping Method */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>
                <div className="space-y-4">
                  {shippingMethods.map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center justify-between p-4 border rounded cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shipping"
                          value={method.id}
                          checked={selectedShipping === method.id}
                          onChange={(e) => setSelectedShipping(e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-gray-500">
                            {method.estimatedDays}
                          </div>
                        </div>
                      </div>
                      <div className="font-medium">${method.price.toFixed(2)}</div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="mr-3"
                      />
                      <div className="font-medium">{method.name}</div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || cart.items.length === 0}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {isLoading ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </div>
                  </div>
                  <div className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <div>Subtotal</div>
                  <div>${cart.total.toFixed(2)}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>Shipping</div>
                  <div>
                    $
                    {(
                      shippingMethods.find((m) => m.id === selectedShipping)
                        ?.price || 0
                    ).toFixed(2)}
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <div>Total</div>
                  <div>
                    $
                    {(
                      cart.total +
                      (shippingMethods.find((m) => m.id === selectedShipping)
                        ?.price || 0)
                    ).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
