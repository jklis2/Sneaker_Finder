import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import SocialButton from "../components/SocialButton";
import Button from "../components/Button";

const API_URL = import.meta.env.VITE_API_URL;

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Attempting login with:", { email: formData.email });
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("Login response:", { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.message || "Błąd logowania");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName
      }));
      
      if (formData.rememberMe) {
        localStorage.setItem("email", formData.email);
      }

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Wystąpił błąd podczas logowania");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-stone-50 shadow-lg rounded-lg p-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Witamy ponownie!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Zaloguj się, aby kontynuować
          </p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <SocialButton icon="/icons/google.svg" name="Google" />
            <SocialButton icon="/icons/apple.svg" name="Apple" />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="h-px w-16 bg-gray-300"></span>
            <span className="text-sm font-medium text-gray-500">
              Lub użyj konta Sneaker Finder{" "}
            </span>
            <span className="h-px w-16 bg-gray-300"></span>
          </div>
          <div>
            <AuthInput
              type="email"
              name="email"
              label="Adres e-mail"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <AuthInput
              type="password"
              name="password"
              label="Hasło"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Zapamiętaj mnie
              </label>
            </div>
            <div className="text-sm">
              <a className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                Zapomniałeś hasła?
              </a>
            </div>
          </div>
          <div>
            <Button 
              name={isLoading ? "Logowanie..." : "Zaloguj się"} 
              disabled={isLoading}
            />
          </div>

          <div className="mt-6 text-center">
            <a 
              onClick={() => navigate("/auth/register")}
              className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
            >
              Nie posiadasz jeszcze konta? Zarejestruj się!
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
