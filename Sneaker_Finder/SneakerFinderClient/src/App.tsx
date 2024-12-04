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

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/product" element={<Product />} />
        <Route path="/styleAdvisor" element={<StyleAdvisor />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}
