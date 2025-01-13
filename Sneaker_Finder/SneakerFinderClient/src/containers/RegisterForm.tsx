import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthInput from "../components/AuthInput";
import SocialButton from "../components/SocialButton";
import Button from "../components/Button";

const API_URL = import.meta.env.VITE_API_URL;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  birthDate: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export default function RegisterForm() {
  const navigate = useNavigate();
  const { t } = useTranslation('registerForm');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.gender !== "Male" && formData.gender !== "Female") {
      setError(t('errors.invalidGender'));
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError(t('errors.acceptTerms'));
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('errors.passwordMismatch'));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          gender: formData.gender,
          birthDate: formData.birthDate,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('errors.registrationFailed'));
      }

      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err instanceof Error
          ? err.message
          : t('errors.registrationFailed')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-stone-50 shadow-lg rounded-lg p-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('subtitle')}
          </p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
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
              {t('orCreateAccount')}
            </span>
            <span className="h-px w-16 bg-gray-300"></span>
          </div>
          <div className="rounded-md shadow-sm -space-y-px">
            <AuthInput
              type="text"
              name="firstName"
              label={t('firstName.label')}
              placeholder={t('firstName.placeholder')}
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <AuthInput
              type="text"
              name="lastName"
              label={t('lastName.label')}
              placeholder={t('lastName.placeholder')}
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
            <AuthInput
              type="email"
              name="email"
              label={t('email.label')}
              placeholder={t('email.placeholder')}
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <AuthInput
              type="text"
              name="gender"
              label={t('gender.label')}
              placeholder={t('gender.placeholder')}
              value={formData.gender}
              onChange={handleInputChange}
              required
            />
            <AuthInput
              type="date"
              name="birthDate"
              label={t('birthDate.label')}
              placeholder={t('birthDate.placeholder')}
              value={formData.birthDate}
              onChange={handleInputChange}
              required
            />
            <AuthInput
              type="password"
              name="password"
              label={t('password.label')}
              placeholder={t('password.placeholder')}
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <AuthInput
              type="password"
              name="confirmPassword"
              label={t('confirmPassword.label')}
              placeholder={t('confirmPassword.placeholder')}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex items-center">
            <div className="flex items-center">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                required
              />
              <label className="ml-2 block text-sm text-gray-900">
                {t('acceptTerms.label')}{" "}
                <span
                  onClick={() => navigate("/privacyPolicy")}
                  className="text-indigo-600 hover:text-indigo-500 cursor-pointer"
                >
                  {t('acceptTerms.link')}
                </span>
              </label>
            </div>
          </div>
          <div>
            <Button
              name={isLoading ? t('registerButton.loading') : t('registerButton')}
              disabled={isLoading}
            />
          </div>
          <div className="text-center">
            <a
              onClick={() => navigate("/auth/login")}
              className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
            >
              {t('hasAccount')}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
