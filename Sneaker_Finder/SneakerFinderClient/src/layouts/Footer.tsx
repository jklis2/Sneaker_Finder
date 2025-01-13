import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation('footer');

  return (
    <footer className="bg-black text-white text-center p-5 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 border-b border-gray-700 py-11 px-4">
        <div className="flex flex-col items-center sm:items-start">
          <Link to="/o-nas" className="mb-2 hover:text-gray-300">
            {t('aboutUs')}
          </Link>
          <Link to="/autentycznosc" className="hover:text-gray-300">
            {t('authenticity')}
          </Link>
          <Link to="/faq" className="mt-2 hover:text-gray-300">
            {t('faq')}
          </Link>
        </div>
        <div className="flex flex-col items-center sm:items-start">
          <Link to="/zwroty-i-wymiany" className="mb-2 hover:text-gray-300">
            {t('returnsAndExchanges')}
          </Link>
          <Link to="/polityka-prywatnosci" className="hover:text-gray-300">
            {t('privacyPolicy')}
          </Link>
          <Link to="/regulamin" className="mt-2 hover:text-gray-300">
            {t('termsAndConditions')}
          </Link>
        </div>
        <div className="flex flex-col items-center sm:items-start">
          <Link to="/reklamacje" className="mb-2 hover:text-gray-300">
            {t('complaints')}
          </Link>
          <Link to="/kontakt" className="hover:text-gray-300">
            {t('contact')}
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
            {t('workingHours')}
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
          <p>&copy; 2024 Sneakers Finder. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}