import H1 from "../components/H1";

interface ProductDescriptionProps {
  description?: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <H1>Opis produktu</H1>
      <p className="mt-4 text-gray-700">
        {description || "Szczegółowy opis produktu będzie dostępny wkrótce."}
      </p>
    </div>
  );
}
