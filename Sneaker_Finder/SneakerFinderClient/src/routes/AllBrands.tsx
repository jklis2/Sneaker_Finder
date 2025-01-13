import { useTranslation } from "react-i18next";
import Navbar from "../layouts/Navbar";
import BrandsCard from "../components/BrandsCard";
import { brands } from "../consts/brands";
import Footer from "../layouts/Footer";

export default function AllBrands() {
  const { t } = useTranslation('allBrands');

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-center">{t('title')}</h1>
        <div className="flex flex-wrap gap-8 justify-center max-w-7xl">
          {brands.map((brand) => (
            <BrandsCard
              key={brand.name}
              name={brand.name}
              photo={brand.image}
              variant="large"
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
