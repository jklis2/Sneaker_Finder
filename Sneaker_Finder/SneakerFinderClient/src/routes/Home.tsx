import Bestsellers from "../containers/Bestsellers";
import Hero from "../containers/Hero";
import LatestProducts from "../containers/LatestProducts";
import PopularBrands from "../containers/PopularBrands";
import Promotions from "../containers/Promotions";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div>
        <Hero />
        <Bestsellers />
        <div id="latest-products">
          <LatestProducts />
        </div>
        <div id="promotions">
          <Promotions />
        </div>
        <PopularBrands />
      </div>
      <Footer />
    </main>
  );
}
