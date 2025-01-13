import { useState, useEffect, useCallback } from "react";
import SearchForm from "./SearchForm";
import hero1 from "../assets/hero1.png";
import hero2 from "../assets/hero2.png";
import hero3 from "../assets/hero3.png";
import { useTranslation } from "react-i18next";

export default function HeroCarousel() {
  const { t } = useTranslation('home');
  const [currentImage, setCurrentImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = [hero1, hero2, hero3];
  const captions = [
    t("hero.caption1"),
    t("hero.caption2"),
    t("hero.caption3"),
  ];

  const changeImage = useCallback(
    (direction: "next" | "prev") => {
      if (isTransitioning) return;

      setIsTransitioning(true);
      setCurrentImage((prev) => {
        if (direction === "next") {
          return (prev + 1) % images.length;
        } else {
          return (prev - 1 + images.length) % images.length;
        }
      });

      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    },
    [isTransitioning, images.length]
  );

  const nextImage = () => changeImage("next");
  const prevImage = () => changeImage("prev");

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      changeImage("next");
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [changeImage]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-500 ${
              currentImage === idx ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={img}
              alt={`Hero image ${idx + 1}`}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black opacity-60"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-white text-6xl font-bold mb-4 text-center px-4">
                {captions[idx]}
              </p>
              {idx === currentImage && <SearchForm />}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevImage}
        disabled={isTransitioning}
        className="absolute z-20 top-1/2 left-3 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full transition-all duration-300"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextImage}
        disabled={isTransitioning}
        className="absolute z-20 top-1/2 right-3 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full transition-all duration-300"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <div className="absolute bottom-6 w-full flex justify-center space-x-3 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (!isTransitioning && currentImage !== idx) {
                setIsTransitioning(true);
                setCurrentImage(idx);
                setTimeout(() => setIsTransitioning(false), 500);
              }
            }}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              currentImage === idx
                ? "bg-white scale-125"
                : "bg-gray-400 hover:bg-gray-300"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
