"use client";

import { ThumbsGallery } from "@/components/carousel/ThumbsGallery";
import { SideDrawer } from "@/components/ShadSideDrawer";
import { useIsMobile } from "@/hooks/use-mobile";

import { usePlayerGalleryUtils } from "@/hooks/usePlayerGallery";
import { IGallery } from "@/types/file.interface";

interface IProps {
  gallery?: IGallery;
  title?: string;
}
export function GalleryViewer({ gallery, title }: IProps) {
  const { images } = usePlayerGalleryUtils([gallery] as IGallery[]);
  const isMobile = useIsMobile("md");
  return (
    <SideDrawer
      id={gallery?._id as string}
      trigger={undefined}
      side="bottom"
      triggerStyles="hidden"
      className="max-h-[95vh]"
    >
      <ThumbsGallery
        title={title}
        images={images}
        thumbnailSwiperStyles={{
          borderRadius: "0%",
          height: "70px",
          width: isMobile ? "100%" : "80%",
        }}
        enableBlur
        slideStyles={{
          width: isMobile ? "100%" : "80%",
          aspectRatio: "auto",
          borderRadius: "0",
          height: "400px",
        }}
      />
    </SideDrawer>
  );
}
