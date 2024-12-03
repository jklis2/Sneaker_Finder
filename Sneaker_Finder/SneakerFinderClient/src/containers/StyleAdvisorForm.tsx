import React, { useState } from "react";
import MultiSelectField from "../components/MultiSelectField";
import SingleSelectField from "../components/SingleSelectField";
import InputField from "../components/InputField";
import StyleChat from "./StyleChat";

interface FormData {
  shoeTypes: string[];
  colors: string[];
  clothingStyle: string;
  season: string;
  occasions: string[];
  materialType: string;
  comfort: string[];
  patterns: string[];
  shoeSize: string;
  clothingSize: string;
  budget: string;
  features: string[];
  gender: string;
  brands: string;
  ecological: string[];
}

const initialFormData: FormData = {
  shoeTypes: [],
  colors: [],
  clothingStyle: "",
  season: "",
  occasions: [],
  materialType: "",
  comfort: [],
  patterns: [],
  shoeSize: "",
  clothingSize: "",
  budget: "",
  features: [],
  gender: "",
  brands: "",
  ecological: [],
};

export default function StyleAdvisorForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChatOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Wybierz Swoje preferencje
            </h2>
            <p className="text-lg text-gray-600">
              Pomóż nam lepiej zrozumieć Twój styl i preferencje
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl rounded-2xl p-8"
          >
            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Podstawowe preferencje
                </h3>
                <div className="space-y-6">
                  <MultiSelectField
                    label="Typ obuwia"
                    name="shoeTypes"
                    options={[
                      "Sportowe",
                      "Eleganckie",
                      "Casual",
                      "Trekkingowe",
                      "Zimowe",
                      "Mokasyny",
                      "Sneakersy",
                      "Sandały",
                      "Klapki",
                      "Szpilki",
                      "Baleriny",
                      "Trampki",
                      "Oksfordy",
                    ]}
                    value={formData.shoeTypes}
                    onChange={(value) =>
                      setFormData({ ...formData, shoeTypes: value })
                    }
                  />

                  <MultiSelectField
                    label="Preferowane kolory"
                    name="colors"
                    options={[
                      "Czarny",
                      "Biały",
                      "Beżowy",
                      "Szary",
                      "Brązowy",
                      "Granatowy",
                      "Zielony",
                      "Czerwony",
                      "Niebieski",
                      "Różowy",
                      "Żółty",
                      "Fioletowy",
                      "Pomarańczowy",
                      "Złoty",
                      "Srebrny",
                    ]}
                    value={formData.colors}
                    onChange={(value) =>
                      setFormData({ ...formData, colors: value })
                    }
                  />
                </div>
              </div>

              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Styl i okazje
                </h3>
                <div className="space-y-6">
                  <SingleSelectField
                    label="Styl ubioru"
                    name="clothingStyle"
                    options={[
                      "Minimalistyczny",
                      "Klasyczny",
                      "Boho",
                      "Streetwear",
                      "Formalny",
                      "Glamour",
                      "Sportowy",
                      "Casual",
                      "Vintage",
                    ]}
                    value={formData.clothingStyle}
                    onChange={(value) =>
                      setFormData({ ...formData, clothingStyle: value })
                    }
                  />

                  <SingleSelectField
                    label="Sezon"
                    name="season"
                    options={[
                      "Letnia",
                      "Zimowa",
                      "Wiosenna",
                      "Jesienna",
                      "Całoroczna",
                    ]}
                    value={formData.season}
                    onChange={(value) =>
                      setFormData({ ...formData, season: value })
                    }
                  />

                  <MultiSelectField
                    label="Okazja"
                    name="occasions"
                    options={[
                      "Na co dzień",
                      "Na siłownię",
                      "Do pracy",
                      "Na wesele",
                      "Na spacer",
                      "Na spotkanie biznesowe",
                      "Na wieczorne wyjście",
                      "Na wakacje",
                      "Na imprezę",
                      "Na wycieczkę w góry",
                      "Na plażę",
                    ]}
                    value={formData.occasions}
                    onChange={(value) =>
                      setFormData({ ...formData, occasions: value })
                    }
                  />
                </div>
              </div>

              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Materiały i komfort
                </h3>
                <div className="space-y-6">
                  <SingleSelectField
                    label="Rodzaj materiału"
                    name="materialType"
                    options={[
                      "Skóra naturalna",
                      "Skóra ekologiczna",
                      "Zamsz",
                      "Tkanina",
                      "Gumowe",
                      "Syntetyczne",
                      "Jeans",
                      "Wełna",
                    ]}
                    value={formData.materialType}
                    onChange={(value) =>
                      setFormData({ ...formData, materialType: value })
                    }
                  />

                  <MultiSelectField
                    label="Preferowany komfort"
                    name="comfort"
                    options={[
                      "Miękka podeszwa",
                      "Twarda podeszwa",
                      "Wkładka ortopedyczna",
                      "Lekkie",
                      "Trwałe",
                    ]}
                    value={formData.comfort}
                    onChange={(value) =>
                      setFormData({ ...formData, comfort: value })
                    }
                  />

                  <MultiSelectField
                    label="Preferencje wzorów"
                    name="patterns"
                    options={[
                      "Gładkie",
                      "Wzorzyste",
                      "Z logo",
                      "Pikowane",
                      "Brokatowe",
                    ]}
                    value={formData.patterns}
                    onChange={(value) =>
                      setFormData({ ...formData, patterns: value })
                    }
                  />
                </div>
              </div>

              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Rozmiary i budżet
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Rozmiar obuwia"
                      name="shoeSize"
                      value={formData.shoeSize}
                      placeholder="Np. EU 42, UK 8, US 9"
                      onChange={(value) =>
                        setFormData({ ...formData, shoeSize: value })
                      }
                    />

                    <InputField
                      label="Rozmiar ubrania"
                      name="clothingSize"
                      value={formData.clothingSize}
                      placeholder="Np. S, M, L, XL lub dokładne wymiary"
                      onChange={(value) =>
                        setFormData({ ...formData, clothingSize: value })
                      }
                    />
                  </div>

                  <SingleSelectField
                    label="Budżet"
                    name="budget"
                    options={[
                      "Do 100 zł",
                      "100-300 zł",
                      "300-500 zł",
                      "Powyżej 500 zł",
                    ]}
                    value={formData.budget}
                    onChange={(value) =>
                      setFormData({ ...formData, budget: value })
                    }
                  />
                </div>
              </div>

              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Dodatkowe preferencje
                </h3>
                <div className="space-y-6">
                  <MultiSelectField
                    label="Dodatkowe cechy"
                    name="features"
                    options={[
                      "Wodoodporne",
                      "Oddychające",
                      "Antypoślizgowe",
                      "Na obcasie",
                      "Płaskie",
                      "Z cholewką",
                      "Bez cholewki",
                    ]}
                    value={formData.features}
                    onChange={(value) =>
                      setFormData({ ...formData, features: value })
                    }
                  />

                  <SingleSelectField
                    label="Płeć"
                    name="gender"
                    options={["Damskie", "Męskie", "Unisex"]}
                    value={formData.gender}
                    onChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  />

                  <InputField
                    label="Preferowane marki"
                    name="brands"
                    value={formData.brands}
                    placeholder="Np. Nike, Adidas, Zara, H&M"
                    onChange={(value) =>
                      setFormData({ ...formData, brands: value })
                    }
                  />

                  <MultiSelectField
                    label="Preferencje ekologiczne"
                    name="ecological"
                    options={[
                      "Ekologiczne materiały",
                      "Produkty wegańskie",
                      "Produkty z recyklingu",
                    ]}
                    value={formData.ecological}
                    onChange={(value) =>
                      setFormData({ ...formData, ecological: value })
                    }
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  Szukaj obuwia dla mnie!
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {isChatOpen && (
        <StyleChat
          preferences={formData}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </>
  );
}
