import ProductInfoComp from "../components/ProductInfoComp";

interface ProductInfoProps {
  name: string;
  price: number;
}

export default function ProductInfo({ name, price }: ProductInfoProps) {
  return <ProductInfoComp name={name} price={price} retail={price * 0.7} />;
}
