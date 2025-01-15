import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Order {
  _id: string;
  userId: string;
  products: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const { userData } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching orders with token:', token);
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log('Orders response:', response.data);
      
      if (!Array.isArray(response.data)) {
        console.error('Response data is not an array:', response.data);
        setError('Invalid response format from server');
        setOrders([]);
        return;
      }
      
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      setUpdating(orderId);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Update the local state with the new order data
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId ? response.data.order : order
          )
        );
      } else {
        setError(response.data.message || 'Failed to update order status');
      }
    } catch (err: any) {
      console.error('Error updating order status:', err);
      setError(err.response?.data?.message || 'Failed to update order status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">Order #{order._id}</h2>
                <p className="text-gray-600">
                  Created: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value as Order['status'])}
                  className="border rounded-md px-3 py-1 bg-white"
                  disabled={updating === order._id}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {updating === order._id && (
                  <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Products:</h3>
              <div className="grid gap-2">
                {order.products.map((product, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{product.name}</span>
                    <span>
                      {product.quantity} x ${product.price}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-right font-semibold">
                Total: ${order.totalAmount}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Shipping Address:</h3>
              {order.shippingAddress ? (
                <p>
                  {order.shippingAddress.street}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                  <br />
                  {order.shippingAddress.country}
                </p>
              ) : (
                <p className="text-gray-500">No shipping address available</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
