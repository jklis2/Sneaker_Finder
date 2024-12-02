interface ProductInfoCompProps {
  name: string;
  price: number;
  retail: number;
}
export default function ProductInfoComp({
  name,
  price,
  retail,
}: ProductInfoCompProps) {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold">{name}</h2>
      <h3 className="text-lg font-semibold">Informations</h3>
      <p className="text-lg">Price: {price}</p>
      <p className="text-lg">Retail price: {retail}</p>
    </div>
  );
}
