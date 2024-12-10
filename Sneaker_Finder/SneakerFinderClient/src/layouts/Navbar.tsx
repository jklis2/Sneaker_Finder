import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import logo from "../assets/logo.png";
import cartIcon from "../assets/icons/cart.svg";
import ordersIcon from "../assets/icons/orders.svg";
import settingsIcon from "../assets/icons/settings.svg";
import logoutIcon from "../assets/icons/logout.svg";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { userData, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
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
            Promocje
          </Link>
          <Link to="/brands" className="text-gray-600 hover:text-gray-800">
            Marki
          </Link>
          <Link to="/products" className="text-gray-600 hover:text-gray-800">
            Produkty
          </Link>
          <Link
            to="/styleAdvisor"
            className="text-gray-600 hover:text-gray-800"
          >
            Asystent modowy
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-gray-800 pr-16">
            Kontakt
          </Link>

          {userData ? (
            <div className="relative flex items-center space-x-4">
              <span className="text-gray-700">
                {userData.firstName} {userData.lastName}
              </span>
              <div className="relative" ref={dropdownRef}>
                <button
                  className="w-8 h-8 bg-green-500 rounded-full cursor-pointer"
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                />
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <ul className="py-2 text-gray-700">
                      <li>
                        <Link
                          to="/cart"
                          className="flex items-center px-4 py-2 hover:bg-gray-100"
                          role="menuitem"
                        >
                          <img
                            src={cartIcon}
                            alt=""
                            className="w-5 h-5 mr-2"
                            aria-hidden="true"
                          />
                          Koszyk
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-2 hover:bg-gray-100"
                          role="menuitem"
                        >
                          <img
                            src={ordersIcon}
                            alt=""
                            className="w-5 h-5 mr-2"
                            aria-hidden="true"
                          />
                          Moje zamówienia
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 hover:bg-gray-100"
                          role="menuitem"
                        >
                          <img
                            src={settingsIcon}
                            alt=""
                            className="w-5 h-5 mr-2"
                            aria-hidden="true"
                          />
                          Ustawienia
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100"
                          role="menuitem"
                        >
                          <img
                            src={logoutIcon}
                            alt=""
                            className="w-5 h-5 mr-2"
                            aria-hidden="true"
                          />
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
