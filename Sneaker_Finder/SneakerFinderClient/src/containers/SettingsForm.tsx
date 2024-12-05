import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";

export default function SettingsForm() {
  const [userData, setUserData] = useState({
    currentEmail: "",
    newEmail: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    language: "pl",
    newsletter: true,
    notifications: {
      email: true,
      push: false,
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setUserData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Ustawienia konta
        </h2>

        <div className="space-y-12">
          {/* Profile Section */}
          <section>
            <h3 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b">
              Profil
            </h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <span className="text-gray-500">Avatar</span>
                </div>
                <Button name="Zmień avatar" />
              </div>
            </div>
          </section>

          {/* Email Section */}
          <section>
            <h3 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b">
              Zmiana email
            </h3>
            <div className="space-y-4">
              <Input
                label="Obecny email"
                id="currentEmail"
                name="currentEmail"
                type="email"
                value={userData.currentEmail}
                onChange={handleChange}
                placeholder="jan.kowalski@example.com"
              />
              <Input
                label="Nowy email"
                id="newEmail"
                name="newEmail"
                type="email"
                value={userData.newEmail}
                onChange={handleChange}
                placeholder="nowy.email@example.com"
              />
              <div className="flex justify-end pt-2">
                <Button name="Zmień email" />
              </div>
            </div>
          </section>

          {/* Password Section */}
          <section>
            <h3 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b">
              Zmiana hasła
            </h3>
            <div className="space-y-4">
              <Input
                label="Obecne hasło"
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={userData.currentPassword}
                onChange={handleChange}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nowe hasło"
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={userData.newPassword}
                  onChange={handleChange}
                />
                <Input
                  label="Potwierdź nowe hasło"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button name="Zmień hasło" />
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section>
            <h3 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b">
              Preferencje
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Język
                </label>
                <select
                  name="language"
                  value={userData.language}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="pl">Polski</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={userData.newsletter}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Chcę otrzymywać newsletter z najnowszymi ofertami
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="notifications.email"
                    checked={userData.notifications.email}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Powiadomienia email o statusie zamówienia
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="notifications.push"
                    checked={userData.notifications.push}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Powiadomienia push w przeglądarce
                  </span>
                </label>
              </div>
            </div>
          </section>

          <div className="pt-6 border-t">
            <div className="flex justify-end space-x-4">
              <Button name="Anuluj" />
              <Button name="Zapisz zmiany" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
