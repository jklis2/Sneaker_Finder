import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import logo from "../assets/logo.png";

interface UserData {
  firstName: string;
  lastName: string;
}

export default function Navbar() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("email");
    setUserData(null);
    navigate("/");
  };

  return (
    <header>
      <nav
        className="flex items-center justify-center p-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-center space-x-8">
          <Link to="/">
            <img src={logo} alt="Sneaker Finder Logo" className="w-[200px] h-auto" />
          </Link>

          <Link to="/" className="text-gray-600 hover:text-gray-800 pl-16 ">
            Nowości
          </Link>
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            Buty
          </Link>
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            Ubrania
          </Link>
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            Akcesoria
          </Link>
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            Kontakt
          </Link>
          <Link to="/" className="text-gray-600 hover:text-gray-800 pr-16">
            Promocje
          </Link>

          {userData ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {userData.firstName} {userData.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Wyloguj
              </button>
            </div>
          ) : (
            <Link to="/auth/login">
              <Button name="Zaloguj się" />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}