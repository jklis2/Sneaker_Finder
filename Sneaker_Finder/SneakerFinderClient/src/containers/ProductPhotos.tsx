interface ProductPhotosProps {
  imageUrl?: string;
  name: string;
}

export default function ProductPhotos({ imageUrl, name }: ProductPhotosProps) {
  return (
    <div className="w-full p-4">
      <div className="h-[400px] flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover scale-110"
          />
        ) : (
          <div className="text-center">
            <span className="text-gray-500 text-sm uppercase">
              {name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
