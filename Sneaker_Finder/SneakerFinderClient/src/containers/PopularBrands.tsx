import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import BrandsCard from "../components/BrandsCard";
import H1 from "../components/H1";
import { brands } from "../consts/brands";

const POPULAR_BRANDS = brands.filter(brand => 
  ["Adidas", "Air Jordan", "Nike", "Yeezy", "BAPE", "Travis Scott"].includes(brand.name)
);

const AUTO_SCROLL_INTERVAL = 10000;
const CARDS_TO_SHOW_DESKTOP = 4;
const CARDS_TO_SHOW_TABLET = 3;
const CARDS_TO_SHOW_MOBILE = 2;
const CARDS_TO_SHOW_SMALL = 1;

export default function PopularBrands() {
  const { t } = useTranslation('home');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(CARDS_TO_SHOW_DESKTOP);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 590) {
        setCardsToShow(CARDS_TO_SHOW_SMALL);
      } else if (window.innerWidth < 815) {
        setCardsToShow(CARDS_TO_SHOW_MOBILE);
      } else if (window.innerWidth < 1035) {
        setCardsToShow(CARDS_TO_SHOW_TABLET);
      } else {
        setCardsToShow(CARDS_TO_SHOW_DESKTOP);
      }
    };

    // Initial check
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const extendedBrands = [...POPULAR_BRANDS, ...POPULAR_BRANDS, ...POPULAR_BRANDS];

  const resetPosition = useCallback(() => {
    setIsTransitioning(false);
    setCurrentIndex(POPULAR_BRANDS.length);
  }, []);

  const startAutoScroll = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex(current => current + 1);
    }, AUTO_SCROLL_INTERVAL);
  }, []);

  const handleTransitionEnd = () => {
    if (currentIndex >= POPULAR_BRANDS.length * 2) {
      resetPosition();
    } else if (currentIndex < POPULAR_BRANDS.length) {
      setCurrentIndex(currentIndex + POPULAR_BRANDS.length);
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startAutoScroll]);

  const handlePrevious = () => {
    setIsTransitioning(true);
    setCurrentIndex(current => current - 1);
    startAutoScroll();
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex(current => current + 1);
    startAutoScroll();
  };

  return (
    <div className="py-8">
      <H1 className="px-12 mb-6">{t('popularBrands.title')}</H1>
      <div className="relative max-w-[1280px] mx-auto px-16">
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 shadow-md hover:shadow-lg transition-shadow z-10 text-xl font-bold"
          aria-label={t('popularBrands.previousButton')}
        >
          &lt;
        </button>

        <div className="overflow-hidden">
          <div 
            className="flex transition-transform ease-in-out"
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% / ${cardsToShow}))`,
              transition: isTransitioning ? 'transform 500ms ease-in-out' : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedBrands.map((brand, index) => (
              <div 
                key={`${brand.name}-${index}`}
                className="flex-shrink-0 w-full xs:w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4"
              >
                <div className="flex justify-center items-center w-full">
                  <BrandsCard
                    name={brand.name}
                    photo={brand.image}
                    variant="large"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 shadow-md hover:shadow-lg transition-shadow z-10 text-xl font-bold"
          aria-label={t('popularBrands.nextButton')}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
