import { Link } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";

export default function OrderConfirmation() {
  return (
    <main>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
          <p className="text-gray-600 mb-8">
            We've received your order and will begin processing it right away.
            You'll receive a confirmation email shortly with your order details.
          </p>
          <div className="space-y-4">
            <Link
              to="/my-orders"
              className="block w-full sm:w-auto sm:inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              View My Orders
            </Link>
            <Link
              to="/"
              className="block w-full sm:w-auto sm:inline-block ml-0 sm:ml-4 border border-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
