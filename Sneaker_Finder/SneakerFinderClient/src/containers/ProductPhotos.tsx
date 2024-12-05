interface ProductPhotosProps {
  imageUrl?: string;
  name: string;
}

export default function ProductPhotos({ imageUrl, name }: ProductPhotosProps) {
  return (
    <div className="w-1/2 p-4">
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="max-h-full max-w-full object-contain"
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
