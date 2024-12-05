import MyOrders from "../containers/MyOrders";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";

export default function Orders() {
  return (
    <>
      <Navbar />
      <MyOrders />
      <Footer />
    </>
  );
}
