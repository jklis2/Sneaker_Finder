import { Link } from "react-router-dom";
import Button from "../components/Button";
import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <header>
      <nav
        className="flex items-center justify-center p-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-center space-x-8">
          <Link to="/">
            <img src={logo} alt="Sneaker Finder Logo" className="w-[300px] h-auto" />
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

          <Button className="" name="Zaloguj się" />
        </div>
      </nav>
    </header>
  );
}