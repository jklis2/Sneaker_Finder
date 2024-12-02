import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white text-center p-5 mt-6">
      <div className="flex justify-evenly items-center border-b border-gray-700 py-11">
        <div className="flex flex-col">
          <Link to="/o-nas" className="mb-2">
            O Nas
          </Link>
          <Link to="/autentycznosc">Autentyczność</Link>
          <Link to="/faq" className="mt-2">
            FAQ
          </Link>
        </div>
        <div className="flex flex-col">
          <Link to="/zwroty-i-wymiany" className="mb-2">
            Zwroty i wymiany
          </Link>
          <Link to="/polityka-prywatnosci">Polityka Prywatności</Link>
          <Link to="/regulamin" className="mt-2">
            Regulamin
          </Link>
        </div>
        <div className="flex flex-col">
          <Link to="/reklamacje" className="mb-2">
            Reklamacje
          </Link>
          <Link to="/kontakt">Kontakt</Link>
        </div>
        <div className="flex flex-col items-center">
          <a href="mailto:orders@sneakerfinder.com" className="mb-2">
            orders@sneakerfinder.com
          </a>
          <a href="tel:+48696996776">+48 696 996 776</a>
          <p className="mt-2">Poniedziałek – piątek od 9:00 do 18:00</p>
        </div>
      </div>
      <div className="flex justify-center space-x-4 py-3 my-5">
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="hover:opacity-75"
        >
          <img
            src="/icons/facebook.svg"
            alt="Facebook"
            className="w-[50px] h-[50px]"
          />
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="hover:opacity-75"
        >
          <img
            src="/icons/instagram.svg"
            alt="Instagram"
            className="w-[50px] h-[50px]"
          />
        </a>
        <a
          href="https://www.tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
          className="hover:opacity-75"
        >
          <img
            src="/icons/tiktok.svg"
            alt="TikTok"
            className="w-[50px] h-[50px]"
          />
        </a>
      </div>
      <div className="flex justify-between items-center w-full">
        <div className="flex text-center text-xs">
          <p> 2024 Sneakers Finder. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}