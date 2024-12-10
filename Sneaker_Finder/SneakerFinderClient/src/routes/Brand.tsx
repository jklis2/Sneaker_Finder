import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";

const BRAND_PRODUCTS = [
  {
    _id: "brand-1",
    name: "Yeezy 350 V2 Bred",
    price: 1099
  },
  {
    _id: "brand-2",
    name: "Yeezy 350 V2 Oreo",
    price: 1099
  },
  {
    _id: "brand-3",
    name: "Yeezy 350 V2 Dazzling",
    price: 1099
  }
];

export default function Brand() {
  const { brandName } = useParams();
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center capitalize">
          {brandName?.replace('-', ' ')} Products
        </h1>
        <div className="flex flex-wrap justify-around items-center gap-4">
          {BRAND_PRODUCTS.map(product => (
            <ProductCard
              key={product._id}
              _id={product._id}
              name={product.name}
              price={product.price}
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
