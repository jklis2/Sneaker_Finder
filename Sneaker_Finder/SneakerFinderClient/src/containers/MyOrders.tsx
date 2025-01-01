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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders');
        console.log('API Response:', response.data);
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Moje zamówienia
      </h1>
      <div className="max-w-4xl mx-auto">
        {orders.map((order) => (
          <OrderCard
            key={order.orderNumber}
            orderNumber={order.orderNumber}
            date={order.date}
            status={order.status}
            products={order.products}
            totalAmount={order.totalAmount}
          />
        ))}
      </div>
    </div>
  );
}
