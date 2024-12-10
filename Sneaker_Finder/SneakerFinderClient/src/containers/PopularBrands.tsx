import { useState, useEffect, useCallback, useRef } from "react";
import BrandsCard from "../components/BrandsCard";
import H1 from "../components/H1";
import { brands } from "../consts/brands";

const POPULAR_BRANDS = brands.filter(brand => 
  ["Adidas", "Air Jordan", "Nike", "Yeezy", "BAPE", "Travis Scott"].includes(brand.name)
);

const AUTO_SCROLL_INTERVAL = 10000;
const CARDS_TO_SHOW = 3;

export default function PopularBrands() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

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
      <H1 className="px-12 mb-6">Popularne Marki</H1>
      <div className="relative max-w-[1200px] mx-auto px-16">
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 shadow-md hover:shadow-lg transition-shadow z-10 text-xl font-bold"
          aria-label="Previous brands"
        >
          &lt;
        </button>

        <div className="overflow-hidden">
          <div 
            className="flex transition-transform ease-in-out"
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% / ${CARDS_TO_SHOW}))`,
              transition: isTransitioning ? 'transform 500ms ease-in-out' : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedBrands.map((brand, index) => (
              <div 
                key={`${brand.name}-${index}`}
                className="flex-shrink-0 px-1"
              >
                <div className="flex justify-center items-center w-full">
                  <BrandsCard
                    name={brand.name}
                    photo={brand.image}
                    variant="default"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 shadow-md hover:shadow-lg transition-shadow z-10 text-xl font-bold"
          aria-label="Next brands"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
