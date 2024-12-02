import H1 from "../components/H1";
import TrendingCard from "../components/TrendingCard";

export default function Bestsellers() {
  return (
    <>
      <H1 className="px-12">Bestsellery</H1>
      <div className="flex justify-around items-center py-10">
        <TrendingCard name="Adidas Yeezy Boost 350 V2 Onyx" price={1099} />
        <TrendingCard name="Jordan 1 UNC" price={899} />
        <TrendingCard name="Jordan 4 Canvas" price={1099} />
      </div>
    </>
  );
}