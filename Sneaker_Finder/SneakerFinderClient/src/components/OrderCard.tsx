interface OrderCardProps {
  orderNumber: string;
  date: string;
  status: string;
  products: {
    name: string;
    size: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
}

export default function OrderCard({ orderNumber, date, status, products, totalAmount }: OrderCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Order #{orderNumber}</h3>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium
          ${status.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-800' :
          status.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'}`}>
          {status}
        </div>
      </div>
      
      <div className="space-y-3">
        {products.map((product, index) => (
          <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2">
            <div className="flex-1">
              <p className="text-gray-800 font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">Size: {product.size}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-800">${product.price.toFixed(2)} x {product.quantity}</p>
              <p className="text-sm font-medium">${(product.price * product.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-200">
        <span className="text-gray-600 font-medium">Total Amount:</span>
        <span className="text-lg font-semibold text-gray-800">${totalAmount.toFixed(2)}</span>
      </div>
    </div>
  );
}