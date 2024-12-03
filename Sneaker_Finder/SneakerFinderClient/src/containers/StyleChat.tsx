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

  const generateRecommendation = (preferences: StyleChatProps['preferences']) => {
    const recommendations = [];
    
    if (preferences.shoeTypes.includes('Sportowe') && preferences.clothingStyle === 'Sportowy') {
      if (preferences.budget === '100-300 zł') {
        recommendations.push(
          "👟 Nike Revolution 6 - klasyczne buty do biegania w przystępnej cenie",
          "👟 Adidas Runfalcon 2.0 - wszechstronne buty treningowe",
          "👟 Puma Resolve - lekkie i przewiewne buty sportowe"
        );
      } else if (preferences.budget === '300-500 zł') {
        recommendations.push(
          "👟 Nike Air Zoom Pegasus - profesjonalne buty do biegania",
          "👟 Adidas UltraBoost - premium buty sportowe z zaawansowaną amortyzacją",
          "👟 New Balance Fresh Foam - komfortowe buty do codziennego użytku"
        );
      }
    }

    if (preferences.season === 'Letnia') {
      recommendations.push(
        "🌞 Polecamy modele z przewiewną siateczką dla lepszej wentylacji",
        "🌞 Wybierz jasną kolorystykę dla lepszego odbijania promieni słonecznych"
      );
    }

    if (preferences.materialType.includes('Tkanina')) {
      recommendations.push("🧶 Modele z oddychającej tkaniny zapewnią komfort w ciepłe dni");
    }

    const finalRecommendation = `
🎯 Rekomendacje butów dopasowane do Twoich preferencji:

${recommendations.join('\n\n')}

💡 Dodatkowe wskazówki:
- Wybrane modele są dostępne w kolorze ${preferences.colors.join(', ')}
- Wszystkie propozycje mieszczą się w budżecie: ${preferences.budget}
- Przeznaczenie: ${preferences.occasions.join(', ')}

🏷️ Gdzie kupić:
- Sklepy sportowe: Nike.com, Adidas.pl, SportsDirect
- Platformy e-commerce: eobuwie.pl, Zalando
    `;

    return finalRecommendation;
  };

  const sendPreferencesToAI = async () => {
    setIsLoading(true);
    
    try {
      const recommendation = generateRecommendation(preferences);
      
      setChatMessages(prev => [...prev, recommendation]);
      
    } catch (error) {
      console.error("Błąd podczas generowania rekomendacji:", error);
      setChatMessages(prev => [...prev, 
        "❌ Przepraszamy, wystąpił błąd podczas generowania rekomendacji. Spróbuj ponownie później."
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
