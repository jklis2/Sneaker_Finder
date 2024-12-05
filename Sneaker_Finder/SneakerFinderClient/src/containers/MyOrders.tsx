import OrderCard from "../components/OrderCard";

export default function MyOrders() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Moje zamówienia
      </h1>
      <div className="max-w-4xl mx-auto">
        <OrderCard
          orderNumber="ORD-2024-001"
          date="2024-01-15"
          status="Delivered"
          products={[
            {
              name: "Nike Air Max 270",
              size: "US 10",
              price: 150.0,
              quantity: 1,
            },
            {
              name: "Nike Socks Pack",
              size: "L",
              price: 20.0,
              quantity: 2,
            },
          ]}
          totalAmount={190.0}
        />

        <OrderCard
          orderNumber="ORD-2024-002"
          date="2024-01-20"
          status="Processing"
          products={[
            {
              name: "Adidas Ultra Boost",
              size: "US 9.5",
              price: 180.0,
              quantity: 1,
            },
          ]}
          totalAmount={180.0}
        />

        <OrderCard
          orderNumber="ORD-2024-003"
          date="2024-01-22"
          status="Pending"
          products={[
            {
              name: "Jordan 1 Retro High",
              size: "US 11",
              price: 200.0,
              quantity: 1,
            },
            {
              name: "Basketball Socks",
              size: "XL",
              price: 15.0,
              quantity: 3,
            },
          ]}
          totalAmount={245.0}
        />
      </div>
    </div>
  );
}
