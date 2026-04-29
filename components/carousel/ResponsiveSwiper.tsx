"use client";

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./responsive-swiper.css";

interface ResponsiveSwiperProps {
  slides: Array<ReactNode>;
  autoplay?: boolean;
  showNavigation?: boolean;
  showPagination?: boolean;
  noSpacing?: boolean;
  swiperStyles?: CSSProperties;
  slideStyles?: CSSProperties;
  doubleCount?: boolean;
  countPerView?: { sm: number; md: number; lg: number; xl: number };
}

export function ResponsiveSwiper({
  slides,
  autoplay = true,
  showNavigation = true,
  showPagination = true,
  noSpacing,
  swiperStyles = {},
  slideStyles = {},
  doubleCount,
  countPerView = { sm: 1, md: 2, lg: 3, xl: 4 },
}: ResponsiveSwiperProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [spaceBetween, setSpaceBetween] = useState(16);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        // Mobile: sm
        setSlidesPerView(countPerView.sm);
        setSpaceBetween(12);
      } else if (width < 768) {
        // Tablet: md
        setSlidesPerView(countPerView.md);
        setSpaceBetween(16);
      } else if (width < 1024) {
        // Laptop: lg
        setSlidesPerView(countPerView.lg);
        setSpaceBetween(20);
      } else {
        // Desktop: xl
        setSlidesPerView(countPerView.xl);
        setSpaceBetween(24);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full">
      <Swiper
        onSwiper={(s) => (swiperRef.current = s)}
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={slidesPerView * (doubleCount ? 2 : 1)}
        spaceBetween={noSpacing ? 0 : spaceBetween}
        navigation={showNavigation}
        pagination={showPagination ? { clickable: true } : false}
        autoplay={
          autoplay
            ? {
                delay: 5000,
                disableOnInteraction: false,
              }
            : false
        }
        loop
        className="w-full"
        style={{ ...swiperStyles }}
      >
        {slides.map((slide, i) => (
          <SwiperSlide
            key={i}
            className="flex items-center justify-center bg-transparent border-none"
            style={slideStyles}
          >
            {slide}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
