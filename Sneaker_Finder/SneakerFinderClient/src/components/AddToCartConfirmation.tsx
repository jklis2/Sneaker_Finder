import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

interface AddToCartConfirmationProps {
  item: CartItem;
  onClose: () => void;
}

export default function AddToCartConfirmation({ item, onClose }: AddToCartConfirmationProps) {
  const { t } = useTranslation('addToCart');

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-4">
            {t('title')}
          </h2>
          <div className="flex items-center space-x-4 mb-6">
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <div className="text-gray-600">
                <p>
                  {t('productDetails.quantity')}: {item.quantity}
                </p>
                <p>
                  {t('productDetails.price')}: ${item.price.toFixed(2)}
                </p>
                {item.size && <p>
                  {t('productDetails.size')}: {item.size}
                </p>}
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Link
              to="/cart"
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
              onClick={onClose}
            >
              {t('buttons.viewCart')}
            </Link>
            <button
              onClick={onClose}
              className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50 transition-colors"
            >
              {t('buttons.continueShopping')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
