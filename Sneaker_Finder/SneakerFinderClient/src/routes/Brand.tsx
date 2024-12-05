import ProductCard from "../components/ProductCard";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";

export default function Brand() {
  return (
    <>
      <Navbar />
      <div className="flex justify-around items-center py-10">
        <ProductCard name="Yeezy 350 V2 Bred" price={1099} />
        <ProductCard name="Yeezy 350 V2 Oreo" price={1099} />
        <ProductCard name="Yeezy 350 V2 Dazzling" price={1099} />
      </div>
      <Footer />
    </>
  );
}
