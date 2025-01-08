import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white text-center p-5 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 border-b border-gray-700 py-11 px-4">
        <div className="flex flex-col items-center sm:items-start">
          <Link to="/o-nas" className="mb-2 hover:text-gray-300">
            O Nas
          </Link>
          <Link to="/autentycznosc" className="hover:text-gray-300">
            Autentyczność
          </Link>
          <Link to="/faq" className="mt-2 hover:text-gray-300">
            FAQ
          </Link>
        </div>
        <div className="flex flex-col items-center sm:items-start">
          <Link to="/zwroty-i-wymiany" className="mb-2 hover:text-gray-300">
            Zwroty i wymiany
          </Link>
          <Link to="/polityka-prywatnosci" className="hover:text-gray-300">
            Polityka Prywatności
          </Link>
          <Link to="/regulamin" className="mt-2 hover:text-gray-300">
            Regulamin
          </Link>
        </div>
        <div className="flex flex-col items-center sm:items-start">
          <Link to="/reklamacje" className="mb-2 hover:text-gray-300">
            Reklamacje
          </Link>
          <Link to="/kontakt" className="hover:text-gray-300">
            Kontakt
          </Link>
        </div>
        <div className="flex flex-col items-center sm:items-start lg:items-center">
          <a 
            href="mailto:orders@sneakerfinder.com" 
            className="mb-2 hover:text-gray-300 break-all"
          >
            orders@sneakerfinder.com
          </a>
          <a 
            href="tel:+48696996776" 
            className="hover:text-gray-300"
          >
            +48 696 996 776
          </a>
          <p className="mt-2 text-sm text-center">
            Poniedziałek – piątek<br className="hidden sm:block lg:hidden" /> od 9:00 do 18:00
          </p>
        </div>
      </div>
      <div className="flex justify-center space-x-4 py-3 my-5">
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="hover:opacity-75 transition-opacity"
        >
          <img
            src="/icons/facebook.svg"
            alt="Facebook"
            className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]"
          />
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="hover:opacity-75 transition-opacity"
        >
          <img
            src="/icons/instagram.svg"
            alt="Instagram"
            className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]"
          />
        </a>
        <a
          href="https://www.tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
          className="hover:opacity-75 transition-opacity"
        >
          <img
            src="/icons/tiktok.svg"
            alt="TikTok"
            className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]"
          />
        </a>
      </div>
      <div className="flex justify-center items-center w-full">
        <div className="text-center text-xs">
          <p>&copy; 2024 Sneakers Finder. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}