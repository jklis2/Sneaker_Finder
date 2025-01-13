import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

interface Order {
  _id: string;
  userId: string;
  products: Array<{
    productId: string;
    quantity: number;
    size: string;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();
  const { isAuthenticated, userData } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const { t } = useTranslation('checkoutSuccess');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) {
          throw new Error(t('errors.noOrderId'));
        }

        if (!isAuthenticated || !userData?._id) {
          navigate("/login");
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(t('errors.fetchFailed'));
        }

        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError(error instanceof Error ? error.message : t('errors.fetchFailed'));
      }
    };

    fetchOrder();
  }, [orderId, isAuthenticated, userData, navigate, t]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <p className="text-xl">{t('thankYou')}</p>
            {order && (
              <p className="text-gray-600">
                {t('orderNumber', { orderNumber: order._id })}
              </p>
            )}
            <p className="text-gray-600">{t('emailConfirmation')}</p>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t('buttons.continueShopping')}
              </button>
              <button
                onClick={() => navigate("/my-orders")}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                {t('buttons.viewOrder')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
