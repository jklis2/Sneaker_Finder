import ProductInfoComp from "../components/ProductInfoComp";

interface ProductInfoProps {
  id: string;
  name: string;
  price: number;
}

export default function ProductInfo({ id, name, price }: ProductInfoProps) {
  return <ProductInfoComp id={id} name={name} price={price} retail={price * 0.7} />;
}
