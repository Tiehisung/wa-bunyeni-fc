import { useState, useRef, CSSProperties } from "react";
import type { Swiper as SwiperClass } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "./thumbs-gallery.css";
import { IFileProps } from "@/types/file.interface";

interface ThumbsGalleryProps {
  images: IFileProps[];
  title?: string;
  enableBlur?: boolean;
  slideStyles?: CSSProperties;
  swiperStyles?: CSSProperties;
  thumbnailSlideStyles?: CSSProperties;
  thumbnailSwiperStyles?: CSSProperties;
  descriptionStyles?: string;
  className?: string;
}

export function ThumbsGallery({
  images,
  title,

  ...props
}: ThumbsGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const mainSwiperRef = useRef<SwiperClass | null>(null);

  const currentImage = images[activeImageIndex];

  return (
    <div
      className={`w-full bg-card rounded-lg overflow-hidden border border-border shadow-lg ${props.className}`}
    >
      {title && (
        <h2 className="text-xl font-light line-clamp-1 p-1.5 ">{title}</h2>
      )}

      {/* Main Gallery */}
      <div className="w-full bg-muted/50">
        <Swiper
          onSwiper={(swiper) => {
            mainSwiperRef.current = swiper;
          }}
          loop={true}
          spaceBetween={10}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          style={{ height: "400px", ...props.swiperStyles }}
          className="main-swiper w-full"
          onSlideChange={(swiper) => setActiveImageIndex(swiper.realIndex)}
        >
          {images?.map((image, i) => (
            <SwiperSlide
              key={image?._id}
              className="bg-muted flex items-center justify-center"
              style={{ ...props.slideStyles }}
            >
              <div
                className="relative w-full h-full bg-cover"
                style={
                  props.enableBlur
                    ? { background: `url(${image?.secure_url})` }
                    : {}
                }
              >
                <img
                  src={image?.secure_url}
                  alt={
                  
                    image?.original_filename ??
                    "gallery" + (i + 1)
                  }
                  className={`w-full h-full ${
                    props.enableBlur
                      ? "object-contain backdrop-blur-xl bg-[white]/50"
                      : "object-cover"
                  }`}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div
        className={
          "bg-background px-6 py-4 border-b border-border " +
          props.descriptionStyles
        }
      >
        <h3 className="text-xl font-semibold text-foreground mb-1">
          {currentImage?.original_filename}
        </h3>
        <p className="text-muted-foreground">{currentImage?.description}</p>
      </div>

      {/* Thumbnails */}
      <div className="bg-background p-4">
        <Swiper
          onSwiper={setThumbsSwiper}
          loop={true}
          spaceBetween={8}
          slidesPerView={5}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="thumbs-swiper"
          breakpoints={{
            320: {
              slidesPerView: 3,
              spaceBetween: 6,
            },
            640: {
              slidesPerView: 4,
              spaceBetween: 8,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 8,
            },
          }}
          style={{ ...props.thumbnailSwiperStyles }}
        >
          {images?.map((image, i) => (
            <SwiperSlide
              key={image?._id}
              className="cursor-pointer opacity-50 hover:opacity-75 transition-opacity"
              style={{ height: "60px", ...props.thumbnailSlideStyles }}
            >
              <div className="relative w-full h-full rounded border border-border overflow-hidden hover:border-primary transition-colors">
                <img
                  src={image?.secure_url}
                  alt={
                
                    image?.original_filename ??
                    "gallery" + (i + 1)
                  }
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
