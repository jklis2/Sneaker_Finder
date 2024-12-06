import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Brand from "./routes/Brand";
import Product from "./routes/Product";
import StyleAdvisor from "./routes/StyleAdvisor";
import Cart from "./routes/Cart";
import Orders from "./routes/Orders";
import Settings from "./routes/Settings";
import AllBrands from "./routes/AllBrands";
import AllProducts from "./routes/AllProducts";
import PrivacyPolicy from "./routes/PrivacyPolicy";
import Contact from "./routes/Contact";
import Checkout from "./routes/Checkout";
import OrderConfirmation from "./routes/OrderConfirmation";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/styleAdvisor" element={<StyleAdvisor />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/allBrands" element={<AllBrands />} />
        <Route path="/allProducts" element={<AllProducts />} />
      </Routes>
    </>
  );
}
