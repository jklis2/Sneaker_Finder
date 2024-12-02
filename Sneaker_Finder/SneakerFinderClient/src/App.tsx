import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Brand from "./routes/Brand";
import Product from "./routes/Product";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/product" element={<Product />} />
      </Routes>
    </>
  );
}
