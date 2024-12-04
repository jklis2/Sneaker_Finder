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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <header>
      <nav
        className="flex items-center justify-center p-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-center space-x-8">
          <Link to="/">
            <img src={logo} alt="Sneaker Finder Logo" className="w-32 h-18" />
          </Link>

          <Link to="/" className="text-gray-600 hover:text-gray-800 pl-16">
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
            <div className="relative flex items-center space-x-4">
              <span className="text-gray-700">
                {userData.firstName} {userData.lastName}
              </span>
              <div className="relative">
                <div
                  className="w-8 h-8 bg-green-500 rounded-full cursor-pointer"
                  onClick={toggleDropdown}
                ></div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <ul className="py-2 text-gray-700">
                      <li>
                        <Link
                          to="/cart"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Koszyk
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Moje zamówienia
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Ustawienia
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Wyloguj
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
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
