'use client'

import { staticImages } from "@/assets/images";
import { ENV } from "@/lib/env";
import { IFileProps } from "@/types/file.interface";
import Image from "next/image";
import { useState } from "react";

interface IFallbackImgProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  fill?: boolean;
  priority?: boolean;
}

export default function IMAGE({
  src,
  alt,
  fallbackSrc = ENV.LOGO_URL,
  ...props
}: IFallbackImgProps) {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(fallbackSrc as string);
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      onError={handleError}
      width={500}
      height={500}
      {...props}
    />
  );
}
interface IProps {
  file: Partial<IFileProps>;
  caption?: string;
  className?: string;
}

export function SlideImage({ file, className = "", caption = "" }: IProps) {
  return (
    <div
      className={`w-full h-full overflow-hidden bg-card hover:shadow-lg transition-shadow relative ${className}`}
    >
      <Image
        src={(file?.secure_url as string) ?? staticImages.ball}
        alt={
          file?.original_filename ||
          `slide image - ${file?.width}"X"${file?.height}`
        }
        className="w-full h-full object-cover"
        loading="lazy"
        width={500}
        height={500}
      />

      <div>
        {caption && (
          <div
            className={`p-4 bg-linear-to-b from-transparent via-modalOverlay to-modalOverlay z-10 absolute bottom-0 right-0 left-0 w-full`}
          >
            <h3 className="font-bold text-lg uppercase text-white text-center">
              {caption}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
