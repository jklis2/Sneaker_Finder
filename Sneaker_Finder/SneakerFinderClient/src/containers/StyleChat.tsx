import { useState, useEffect, useRef } from "react";

interface Message {
  text: string;
  isUser: boolean;
}

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
  isVisible: boolean;
}

export default function StyleChat({ preferences, isVisible }: StyleChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

💬 Możesz zadać mi dodatkowe pytania dotyczące rekomendacji!
    `;

    return finalRecommendation;
  };

  const generateResponse = (userMessage: string) => {
    const messageLower = userMessage.toLowerCase();
    
    if (messageLower.includes('cena') || messageLower.includes('kosztuje')) {
      return "Ceny mogą się różnić w zależności od sklepu i dostępnych promocji. Polecam sprawdzić aktualne ceny na stronach sklepów, które wymieniłem powyżej.";
    }
    
    if (messageLower.includes('rozmiar') || messageLower.includes('size')) {
      return "Każdy producent może mieć nieco inną tabelę rozmiarów. Najlepiej zmierzyć długość stopy w centymetrach i porównać z tabelą rozmiarów na stronie producenta. Zawsze możesz też zapytać o konkretny model!";
    }
    
    if (messageLower.includes('dostępn') || messageLower.includes('gdzie')) {
      return "Najlepiej sprawdzić dostępność na oficjalnych stronach producentów lub w dużych sklepach online jak eobuwie.pl czy Zalando. Możesz też odwiedzić sklepy stacjonarne w swojej okolicy.";
    }

    if (messageLower.includes('kolor') || messageLower.includes('kolory')) {
      return `Wybrałeś następujące kolory: ${preferences.colors.join(', ')}. Wszystkie rekomendowane modele są dostępne w tych kolorach. Jeśli chcesz zobaczyć inne opcje kolorystyczne, daj znać!`;
    }

    return "Przepraszam, nie do końca rozumiem pytanie. Możesz zapytać mnie o cenę, rozmiary, dostępność lub kolory konkretnych modeli butów.";
  };

  const sendPreferencesToAI = async () => {
    setIsLoading(true);
    
    try {
      const recommendation = generateRecommendation(preferences);
      setMessages([{ text: recommendation, isUser: false }]);
    } catch (error) {
      console.error("Błąd podczas generowania rekomendacji:", error);
      setMessages([{ 
        text: "❌ Przepraszamy, wystąpił błąd podczas generowania rekomendacji. Spróbuj ponownie później.",
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    setMessages(prev => [...prev, { text: inputMessage, isUser: true }]);
    
    const response = generateResponse(inputMessage);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    }, 500);

    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (isVisible && messages.length === 0) {
      sendPreferencesToAI();
    }
  }, [isVisible]);

  return (
    <div className={`mt-8 transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
      <div className="bg-white w-full max-w-3xl mx-auto rounded-lg shadow-lg border border-gray-200">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Twoje Rekomendacje
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-6 max-h-[600px] overflow-y-auto px-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${
                    message.isUser
                      ? 'bg-blue-50 ml-12'
                      : 'bg-gray-50 mr-12'
                  } p-6 rounded-xl shadow-sm border border-gray-100 text-gray-800 leading-relaxed`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {message.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-4">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Zadaj pytanie dotyczące rekomendacji..."
              className="flex-1 min-h-[50px] max-h-[100px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Wyślij
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
