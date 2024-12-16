import ProductInfoComp from "../components/ProductInfoComp";

interface ProductInfoProps {
  id: string;
  name: string;
  price: number;
  retail?: number;
  brand?: string;
  availableSizes?: string[];
  color?: string;
}

export default function ProductInfo({ 
  id, 
  name, 
  price,
  retail = price * 0.7,
  brand = "",
  availableSizes,
  color
}: ProductInfoProps) {
  console.log('ProductInfo props:', { id, name, price, retail, brand, availableSizes, color }); // Debug log
  
  return (
    <ProductInfoComp 
      id={id} 
      name={name} 
      price={price} 
      retail={retail}
      brand={brand}
      availableSizes={availableSizes}
      color={color}
    />
  );
}
