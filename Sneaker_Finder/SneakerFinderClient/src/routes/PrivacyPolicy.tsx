import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Polityka Prywatności</h1>
        <div className="prose">
          <p>
            Witamy w aplikacji Sneaker Finder! Twoja prywatność jest dla nas
            bardzo ważna. Niniejsza Polityka Prywatności wyjaśnia, w jaki sposób
            gromadzimy, wykorzystujemy i chronimy Twoje dane osobowe podczas
            korzystania z naszej aplikacji lub usług.
          </p>

          <h2 className="text-2xl font-semibold mt-4">
            1. Administrator danych
          </h2>
          <p>
            Administratorem Twoich danych osobowych jest Sneaker Finder Sp. z
            o.o. z siedzibą w Warszawie. W sprawach związanych z przetwarzaniem
            danych osobowych możesz skontaktować się z nami pod adresem e-mail:
            privacy@sneakerfinder.com.
          </p>

          <h2 className="text-2xl font-semibold mt-4">
            2. Zakres zbieranych danych
          </h2>
          <p>
            Podczas korzystania z naszej aplikacji możemy gromadzić następujące
            dane:
          </p>
          <ul>
            <li>Dane rejestracyjne: imię, nazwisko, adres e-mail, hasło.</li>
            <li>
              Dane techniczne: adres IP, typ urządzenia, system operacyjny.
            </li>
            <li>
              Dane dotyczące korzystania z aplikacji: historia wyszukiwań,
              preferencje użytkownika.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-4">
            3. Cele przetwarzania danych
          </h2>
          <p>Twoje dane osobowe są przetwarzane w następujących celach:</p>
          <ul>
            <li>Umożliwienia korzystania z aplikacji Sneaker Finder.</li>
            <li>Dostosowania treści i funkcji do Twoich preferencji.</li>
            <li>
              Obsługi zgłoszeń użytkowników i udzielania wsparcia technicznego.
            </li>
            <li>
              Przeprowadzania analiz statystycznych i poprawy działania
              aplikacji.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-4">
            4. Podstawa prawna przetwarzania danych
          </h2>
          <p>
            Dane przetwarzamy na podstawie Twojej zgody, w celu wykonania umowy,
            wypełnienia obowiązków prawnych oraz w uzasadnionym interesie
            administratora danych.
          </p>

          <h2 className="text-2xl font-semibold mt-4">
            5. Przechowywanie danych
          </h2>
          <p>
            Twoje dane będą przechowywane przez okres niezbędny do realizacji
            celów przetwarzania lub do momentu wycofania zgody, o ile nie
            istnieje inna podstawa prawna do ich przetwarzania.
          </p>

          <h2 className="text-2xl font-semibold mt-4">
            6. Udostępnianie danych
          </h2>
          <p>
            Twoje dane mogą być udostępniane podmiotom wspierającym nas w
            świadczeniu usług, np. dostawcom usług IT, a także organom
            państwowym, jeśli wymagają tego przepisy prawa.
          </p>

          <h2 className="text-2xl font-semibold mt-4">7. Twoje prawa</h2>
          <p>
            W związku z przetwarzaniem danych osobowych przysługuje Ci prawo do:
          </p>
          <ul>
            <li>Dostępu do swoich danych.</li>
            <li>Sprostowania swoich danych.</li>
            <li>Usunięcia danych (prawo do bycia zapomnianym).</li>
            <li>Ograniczenia przetwarzania danych.</li>
            <li>Przenoszenia danych do innego administratora.</li>
            <li>Wniesienia sprzeciwu wobec przetwarzania danych.</li>
            <li>Złożenia skargi do organu nadzorczego.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-4">8. Kontakt</h2>
          <p>
            Wszelkie pytania i wątpliwości dotyczące niniejszej Polityki
            Prywatności prosimy kierować na adres e-mail:
            privacy@sneakerfinder.com.
          </p>
        </div>
        <div className="mt-8">
          <Button
            name="Powrót do rejestracji"
            onClick={() => navigate("/auth/register")}
          />
        </div>
      </div>
    </div>
  );
}
