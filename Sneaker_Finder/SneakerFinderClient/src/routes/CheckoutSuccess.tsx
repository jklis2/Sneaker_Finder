import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";

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
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  useAuth();
  const { clearItems } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const { t } = useTranslation("checkoutSuccess");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!sessionId) {
          throw new Error(t("errors.noSessionId"));
        }

        const token = localStorage.getItem("token");

        const sessionResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders/session/${sessionId}`,
          {
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        if (!sessionResponse.ok) {
          throw new Error(t("errors.fetchingOrder"));
        }

        const orderData = await sessionResponse.json();
        setOrder(orderData);

        clearItems();
        localStorage.removeItem("cart");

        if (token) {
          const userId = orderData.userId;
          await fetch(
            `${import.meta.env.VITE_API_URL}/api/cart/clear?userId=${userId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    fetchOrder();
  }, [clearItems, sessionId, t]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="text-xl">{t("thankYou")}</p>
            {order ? (
              <p className="text-green-600">
                {t("orderNumber", { orderNumber: order._id })}
              </p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <p className="text-gray-600">{t("loading")}</p>
            )}
            <p className="text-gray-600">{t("emailConfirmation")}</p>
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t("buttons.continueShopping")}
              </button>
              <button
                onClick={() => navigate("/orders")}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                {t("buttons.viewOrder")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
