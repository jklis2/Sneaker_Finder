import H1 from "../components/H1";
import ProductCard from "../components/ProductCard";

const BESTSELLER_PRODUCTS = [
  {
    _id: "bestseller-1",
    name: "Adidas Yeezy Boost 350 V2 Onyx",
    price: 1099
  },
  {
    _id: "bestseller-2",
    name: "Jordan 1 UNC",
    price: 899
  },
  {
    _id: "bestseller-3",
    name: "Jordan 4 Canvas",
    price: 1099
  }
];

export default function Bestsellers() {
  return (
    <>
      <H1 className="px-12">Bestsellery</H1>
      <div className="flex justify-around items-center py-10">
        {BESTSELLER_PRODUCTS.map(product => (
          <ProductCard
            key={product._id}
            _id={product._id}
            name={product.name}
            price={product.price}
            size="normal"
          />
        ))}
      </div>
    </>
  );
}
