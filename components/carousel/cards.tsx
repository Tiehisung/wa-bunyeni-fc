 

import React, { CSSProperties } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

import "./card.css";

// import required modules
import { Autoplay, EffectCards } from "swiper/modules";

export interface ICardCarouselProps {
  cards: Array<React.ReactNode>;
  slideClassName?: string;
  autoplay?: boolean;
  swiperStyles?: CSSProperties;
  effect?:
    | "cards"
    | "slide"
    | "fade"
    | "cube"
    | "coverflow"
    | "flip"
    | "creative";
}

export default function CardCarousel({
  cards = [1, 2, 3, 4, 5, 6, 7],
  slideClassName,
  effect = "cards",
  autoplay = true,
  swiperStyles,
}: ICardCarouselProps) {
  return (
    <>
      <Swiper
        effect={effect}
        grabCursor={true}
        modules={[EffectCards, Autoplay]}
        className="mySwiper"
        autoplay={
          autoplay
            ? {
                delay: 5000,
                disableOnInteraction: false,
              }
            : false
        }
        style={{ ...swiperStyles }}
      >
        {cards.map((card, index) => (
          <SwiperSlide className={`${slideClassName}`} key={index}>
            {card}
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
