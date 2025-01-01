import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // You can optionally verify the session here
      setTimeout(() => {
        navigate('/orders'); // Redirect to orders page after successful payment
      }, 3000);
    }
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
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
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Płatność zakończona sukcesem!
        </h2>
        <p className="text-gray-600 mb-8">
          Dziękujemy za zakupy. Za chwilę zostaniesz przekierowany do swoich zamówień.
        </p>
      </div>
    </div>
  );
}
