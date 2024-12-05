import H1 from "../components/H1";
import ProductCard from "../components/ProductCard";

export default function Bestsellers() {
  return (
    <>
      <H1 className="px-12">Bestsellery</H1>
      <div className="flex justify-around items-center py-10">
        <ProductCard
          name="Adidas Yeezy Boost 350 V2 Onyx"
          price={1099}
          size="normal"
        />
        <ProductCard name="Jordan 1 UNC" price={899} size="normal" />
        <ProductCard name="Jordan 4 Canvas" price={1099} size="normal" />
      </div>
    </>
  );
}
