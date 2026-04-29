 

import  { ReactNode, useEffect, useRef, useState } from "react";
import { TfiAngleLeft, TfiAngleRight } from "react-icons/tfi";

interface CarouselProps {
  children?: ReactNode[];
  scrollGap?: number;
  wrapperStyles?: string;
  className?: string;
  scrollButtonStyles?: string;
}

const SimpleCarousel = ({
  children=[],
  scrollGap = 300,
  wrapperStyles,
  className,
  scrollButtonStyles,
}: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -scrollGap, // Adjust scroll distance
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: scrollGap, // Adjust scroll distance
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    updateScrollButtons();

    const handleResize = () => {
      updateScrollButtons();
    };

    if (carouselRef.current) {
      carouselRef.current.addEventListener("scroll", updateScrollButtons);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      if (carouselRef.current) {
        carouselRef.current.removeEventListener("scroll", updateScrollButtons);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div
      className={`relative mx-auto overflow-hidden max-w-full ${wrapperStyles}`}
    >
      <button
        className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-modalOverlay text-white p-2 rounded-full z-10 disabled:pointer-events-none disabled:bg-gray-100 disabled:text-gray-700 ${
          children?.length < 2 && "hidden"
        } ${scrollButtonStyles}`}
        onClick={scrollLeft}
        disabled={!canScrollLeft}
      >
        <TfiAngleLeft />
      </button>

      <div
        className={`flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth max-w-full px-5 ${className}`}
        ref={carouselRef}
      >
        {children?.map((component, index) => (
          <div key={index}>{component}</div>
        ))}
      </div>
      <button
        className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-modalOverlay text-white p-2 rounded-full disabled:pointer-events-none disabled:bg-gray-100 disabled:text-gray-700 z-10 ${
          children?.length < 2 && "hidden"
        } ${scrollButtonStyles}`}
        onClick={scrollRight}
        disabled={!canScrollRight}
      >
        <TfiAngleRight />
      </button>
    </div>
  );
};

export default SimpleCarousel;
