import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import logo from "../assets/logo.png";
import cartIcon from "../assets/icons/cart.svg";
import ordersIcon from "../assets/icons/orders.svg";
import settingsIcon from "../assets/icons/settings.svg";
import logoutIcon from "../assets/icons/logout.svg";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, logout } = useAuth();
  const { getCartItemsCount } = useCart();

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

  useEffect(() => {
    if (location.pathname === "/" && location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      // Clear the state after scrolling
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSectionClick = (sectionId: string) => {
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { scrollTo: sectionId } });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after clicking
  };

  const NavLinks = () => (
    <>
      <button 
        onClick={() => handleSectionClick('latest-products')} 
        className="text-gray-600 hover:text-gray-800 w-full text-center"
      >
        Nowości
      </button>
      <button 
        onClick={() => handleSectionClick('promotions')} 
        className="text-gray-600 hover:text-gray-800 w-full text-center"
      >
        Promocje
      </button>
      <Link to="/brands" className="text-gray-600 hover:text-gray-800 w-full text-center">
        Marki
      </Link>
      <Link to="/products" className="text-gray-600 hover:text-gray-800 w-full text-center">
        Produkty
      </Link>
      <Link to="/styleAdvisor" className="text-gray-600 hover:text-gray-800 w-full text-center">
        Asystent modowy
      </Link>
      <Link to="/contact" className="text-gray-600 hover:text-gray-800 w-full text-center">
        Kontakt
      </Link>
    </>
  );

  return (
    <header className="relative bg-white">
      <nav
        className="flex items-center justify-between p-6 lg:px-8 relative z-50"
        aria-label="Main navigation"
      >
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Sneaker Finder Logo" className="w-32 h-18" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <NavLinks />
        </div>

        {/* User Section - Always Visible */}
        <div className="flex items-center">
          {userData ? (
            <div className="relative flex items-center">
              <span className="text-gray-700">
                {userData.firstName} {userData.lastName}
              </span>
              <div className="relative" ref={dropdownRef}>
                <button
                  className="w-8 h-8 bg-green-500 rounded-full cursor-pointer ml-4"
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
                          <span className="flex-grow">Koszyk</span>
                          {getCartItemsCount() > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                              {getCartItemsCount()}
                            </span>
                          )}
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
              <button
                className="lg:hidden p-2 ml-4"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle mobile menu"
              >
                <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
                <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
                <div className="w-6 h-0.5 bg-gray-600"></div>
              </button>
            </div>
          ) : (
            <Link to="/auth/login">
              <Button name="Zaloguj się" />
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        ref={mobileMenuRef}
        className={`fixed left-0 right-0 bg-white shadow-lg z-40 lg:hidden overflow-hidden transition-[max-height] duration-200 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
        }`}
        style={{ top: '80px' }}
      >
        <div className="flex flex-col items-center space-y-6 py-8">
          <NavLinks />
        </div>
      </div>
    </header>
  );
}
