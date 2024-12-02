import TrendingCard from "../components/TrendingCard";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";

export default function Brand() {
  return (
    <>
      <Navbar />
      <div className="flex justify-around items-center py-10">
        <TrendingCard name="Yeezy 350 V2 Bred" price={1099} />
        <TrendingCard name="Yeezy 350 V2 Oreo" price={1099} />
        <TrendingCard name="Yeezy 350 V2 Dazzling" price={1099} />
      </div>
      <Footer />
    </>
  );
}