"use client";

import { useMemo } from "react";
import { IGallery } from "@/types/file.interface";
import { IFileProps } from "@/types/file.interface";
import { staticImages } from "@/assets/images";
/**
 * Hook for managing a player's gallery content.
 * - Random image or video selection
 * - Avatar fallback
 * - Flattened slides for carousel/lightbox
 */
export const usePlayerGalleryUtils = (galleries?: IGallery[]) => {
  return useMemo(() => {
    if (!galleries) {
      return {
        randomImage: undefined,
        randomGallery: undefined,
        slides: [] as IFileProps[],
        images: [] as IFileProps[],
        videos: [] as IFileProps[],
        totalImages: 0,
        totalVideos: 0,
        totalGalleries: 0,
      };
    }

    // 🖼 Flatten all files across galleries
    const allFiles = galleries.flatMap((g) => g?.files || []);

    // Separate by type
    const images = allFiles.filter((f) => f.resource_type === "image");
    const videos = allFiles.filter((f) => f.resource_type === "video");

    // Pick a random gallery
    const randomGallery =
      galleries.length > 0
        ? galleries[Math.floor(Math.random() * galleries.length)]
        : undefined;

    // Pick a random image (fallback to avatar if none)
    const randomImage =
      images.length > 0
        ? images[Math.floor(Math.random() * images.length)]
        : staticImages.avatar;

    // Combine all media for slides
    const slides = allFiles.length > 0 ? allFiles : [staticImages.avatar];

    return {
      randomImage,
      randomGallery,
      slides,
      images,
      videos,
      totalImages: images.length,
      totalVideos: videos.length,
      totalGalleries: galleries.length,
    };
  }, [galleries]);
};
