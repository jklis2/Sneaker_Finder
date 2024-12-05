import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.gender !== "Male" && formData.gender !== "Female") {
      setError("Gender must be either 'Male' or 'Female'");
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError("Please accept the terms and conditions");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
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
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          _id: data._id,
          firstName: data.firstName,
          lastName: data.lastName,
        })
      );

      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during registration"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-stone-50 shadow-lg rounded-lg p-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign up
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please Sign up to continue
          </p>
        </div>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
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
              Or create Sneaker Finder account{" "}
            </span>
            <span className="h-px w-16 bg-gray-300"></span>
          </div>
          <div>
            <AuthInput
              type="text"
              name="firstName"
              label="First Name"
              placeholder="Enter your First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <AuthInput
              type="text"
              name="lastName"
              label="Last Name"
              placeholder="Enter your Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
            <AuthInput
              type="email"
              name="email"
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <AuthInput
              type="text"
              name="gender"
              label="Gender"
              placeholder="Enter 'Male' or 'Female'"
              value={formData.gender}
              onChange={handleInputChange}
              required
            />
            <AuthInput
              type="date"
              name="birthDate"
              label="Birth date"
              placeholder="Birth Date"
              value={formData.birthDate}
              onChange={handleInputChange}
              required
            />
            <AuthInput
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <AuthInput
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                required
              />
              <label className="ml-2 block text-sm text-gray-900">
                I accept {" "}
                <span
                  onClick={() => navigate("/privacyPolicy")}
                  className="text-indigo-600 hover:text-indigo-500 cursor-pointer"
                >
                  the regulations and privacy policy
                </span>
              </label>
            </div>
          </div>
          <div>
            <Button
              name={isLoading ? "Signing up..." : "Sign up"}
              disabled={isLoading}
            />
          </div>

          <div className="mt-6 text-center">
            <a
              onClick={() => navigate("/auth/login")}
              className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
            >
              Already have an account? Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
