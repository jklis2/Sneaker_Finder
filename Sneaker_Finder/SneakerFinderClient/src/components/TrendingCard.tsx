interface TrendingCardProps {
  name: string;
  price: number;
}

export default function TrendingCard({ name, price }: TrendingCardProps) {
  return (
    <div className="border border-gray-300 shadow-lg rounded-lg p-4 w-1/4">
      <div className="h-40 w-full flex items-center justify-center bg-red-500">
        {/* Placeholder for the image */}
        <span className="text-white text-xs uppercase">Image placeholder</span>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-lg">${price.toFixed(2)}</p>
      </div>
    </div>
  );
}
