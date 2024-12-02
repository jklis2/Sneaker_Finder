import Bestsellers from "../containers/Bestsellers";
import Hero from "../containers/Hero";
import PopularBrands from "../containers/PopularBrands";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar/>
      <div>
        <Hero />
        <Bestsellers />
        <PopularBrands />
      </div>
      <Footer/>
    </main>
  );
}