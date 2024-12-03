import { useState } from "react";

interface StyleChatProps {
  preferences: {
    shoeTypes: string[];
    colors: string[];
    clothingStyle: string;
    season: string;
    occasions: string[];
    materialType: string[];
    comfort: string[];
    patterns: string[];
    shoeSize: string;
    clothingSize: string;
    budget: string;
    features: string[];
    gender: string;
    brands: string;
    ecological: string[];
  };
  onClose: () => void;
}

export default function StyleChat({ preferences, onClose }: StyleChatProps) {
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendPreferencesToAI = async () => {
    setIsLoading(true);
  
    try {
      const minimalPreferences = {
        shoeTypes: preferences.shoeTypes,
        colors: preferences.colors,
        clothingStyle: preferences.clothingStyle,
        season: preferences.season,
      };
  
      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
          },
          body: JSON.stringify({
            inputs: `Oto moje preferencje: ${JSON.stringify(minimalPreferences)}`,
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Szczegóły błędu:", errorData);
        throw new Error(`Błąd: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Dane z API:", data);
  
      const aiResponse = data.generated_text || "Nie otrzymano odpowiedzi od AI.";
      setChatMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Błąd podczas komunikacji z AI:", error);
      setChatMessages((prev) => [
        ...prev,
        "Wystąpił błąd podczas komunikacji z AI.",
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 rounded-full px-4 py-2 text-sm font-bold hover:bg-gray-300"
        >
          Zamknij
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Twoje wyniki:
        </h2>

        {isLoading ? (
          <p className="text-center text-gray-600">Ładowanie...</p>
        ) : (
          <div className="space-y-4">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg shadow-inner text-gray-800"
              >
                {message}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={sendPreferencesToAI}
          disabled={isLoading}
          className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700"
        >
          {isLoading ? "Analizuję..." : "Wyślij preferencje"}
        </button>
      </div>
    </div>
  );
}
