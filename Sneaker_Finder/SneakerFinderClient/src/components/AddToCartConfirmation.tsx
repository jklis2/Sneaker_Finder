import { Link } from "react-router-dom";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface AddToCartConfirmationProps {
  item: CartItem;
  onClose: () => void;
}

export default function AddToCartConfirmation({ item, onClose }: AddToCartConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-green-500"
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
          <h2 className="text-2xl font-bold mb-4">Added to Cart!</h2>
          <div className="mb-6">
            <p className="text-lg font-semibold">{item.name}</p>
            <p className="text-gray-600">Quantity: {item.quantity}</p>
            <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              to="/cart"
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              Checkout
            </Link>
            <button
              onClick={onClose}
              className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
