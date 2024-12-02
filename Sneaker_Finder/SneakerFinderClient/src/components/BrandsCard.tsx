type BrandsCardProps = {
  photo?: string;
  name: string;
  icon?: string;
};

export default function BrandsCard({ name }: BrandsCardProps) {
  return (
    <div className="flex flex-col items-center p-2 bg-gray-100 rounded-lg shadow-sm w-1/5">
      <div className="w-full h-24 bg-red-500 flex items-center justify-center">
        <span className="text-white text-sm">Image placeholder</span>
      </div>
      <div className="w-full flex justify-between items-center mt-2">
        <span className="text-sm font-semibold">{name}</span>
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">Icon</span>
        </div>
      </div>
    </div>
  );
}
