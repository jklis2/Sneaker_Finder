import OrderCard from "../components/OrderCard";
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  name: string;
  size: string;
  price: number;
  quantity: number;
}

interface Order {
  orderNumber: string;
  date: string;
  status: string;
  products: Product[];
  totalAmount: number;
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view orders');
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('API Response:', response.data);
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders');
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Moje zamówienia
      </h1>
      <div className="max-w-4xl mx-auto">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found</p>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.orderNumber}
              orderNumber={order.orderNumber}
              date={order.date}
              status={order.status}
              products={order.products}
              totalAmount={order.totalAmount}
            />
          ))
        )}
      </div>
    </div>
  );
}
