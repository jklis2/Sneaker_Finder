import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import { useAuth } from "../context/AuthContext";
import { getShippingAddresses } from "../services/userService";
import { useTranslation } from "react-i18next";

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
  imageUrl?: string;
  size?: string;
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

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
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
  const { t } = useTranslation('checkout');

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
        throw new Error(t('errors.loginRequired'));
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error(t('errors.tokenNotFound'));
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
        throw new Error(errorData.message || t('errors.checkoutFailed'));
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
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError(error instanceof Error ? error.message : t('errors.checkoutFailed'));
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
      setError(t('errors.loadAddressesFailed'));
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
        throw new Error(t('errors.loginRequired'));
      }
  
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error(t('errors.tokenNotFound'));
      }
  
// Validate and get shipping address
if (selectedAddressIndex === null) {
  throw new Error('Please select a shipping address');
}
const selectedAddress = savedAddresses[selectedAddressIndex];
console.log('Selected address:', selectedAddress); // Debug log
const mappedAddress = {
  street: `${selectedAddress.street} ${selectedAddress.number}`,
  city: selectedAddress.city,
  state: selectedAddress.province,
  zipCode: selectedAddress.postalCode,
  country: "Poland"
};
console.log('Mapped address:', mappedAddress); // Debug log
  
      // Create Stripe checkout session with shipping address
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout/create-checkout-session?userId=${userData._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ shippingAddress: mappedAddress }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || t('errors.checkoutFailed'));
      }
  
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      setError(error instanceof Error ? error.message : t('errors.checkoutFailed'));
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
          <div className="text-center">{t('loading')}</div>
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
            <h2 className="text-2xl font-bold">{t('checkout')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('contactInfo.title')}</h3>
                <div className="space-y-4">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder={t('contactInfo.email')}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Shipping Address Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">{t('shippingAddress.title')}</h3>
                
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
                      {t('shippingAddress.addNew')}
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
                        placeholder={t('shippingAddress.street')}
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
                        placeholder={t('shippingAddress.apartment')}
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
                        placeholder={t('shippingAddress.city')}
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
                        placeholder={t('shippingAddress.state')}
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
                        placeholder={t('shippingAddress.zipCode')}
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
                        placeholder={t('shippingAddress.phone')}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('shippingInfo.title')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder={t('shippingInfo.firstName')}
                    required
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder={t('shippingInfo.lastName')}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Shipping Method */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('shippingMethod.title')}</h3>
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
                          <div className="font-medium">{t(`shippingMethod.${method.id}.name`)}</div>
                          <div className="text-sm text-gray-500">
                            {t(`shippingMethod.${method.id}.time`)}
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
                <h3 className="text-lg font-semibold mb-4">{t('paymentMethod.title')}</h3>
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
                      <div className="font-medium">{t(`paymentMethod.${method.id}`)}</div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || cart.items.length === 0}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {isLoading ? t('buttons.processing') : t('buttons.placeOrder')}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('orderSummary.title')}</h2>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={item.imageUrl || "/images/placeholder.png"}
                        alt={item.name}
                        className="w-full h-full object-contain rounded"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{t('orderSummary.quantity')}: {item.quantity}</p>
                      {item.size && (
                        <p className="text-sm text-gray-500">{t('orderSummary.size')}: {item.size}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <div>{t('orderSummary.subtotal')}</div>
                  <div>${cart.total.toFixed(2)}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>{t('orderSummary.shipping')}</div>
                  <div>
                    $
                    {(
                      shippingMethods.find((m) => m.id === selectedShipping)
                        ?.price || 0
                    ).toFixed(2)}
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <div>{t('orderSummary.total')}</div>
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
