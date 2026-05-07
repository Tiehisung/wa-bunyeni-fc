"use client";

import { IGallery } from "@/types/file.interface";
import { SecondaryGalleryCard } from "./GalleryCardSecondary";
import { PrimaryGalleryCard } from "./GalleryCardPrimary";
import { useGetGalleriesQuery } from "@/services/gallery.endpoints";
import Loader from "../loaders/Loader";
interface GalleryGridProps {
  galleries?: IGallery[];
  showDate?: boolean;
  card?: "primary" | "secondary";
  tags?: string[];
}

export default function GalleryGrid({
  galleries=[],
  card = "primary",
  tags = [],
}: GalleryGridProps) {
  const { data: galleriesData, isLoading } = useGetGalleriesQuery(
    { limit: 3, tags: tags?.join(",") },
    {
      skip: galleries?.length > 0,
    },
  );

  const displayedGalleries =
    galleries?.length > 0 ? galleries : galleriesData?.data || [];

  if (isLoading) {
    return <Loader />;
  }

  if (!displayedGalleries?.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No galleries found.
      </div>
    );
  }
  if (card == "secondary")
    return (
      <>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 "
          id="gallery"
        >
          {displayedGalleries?.map((gallery) => (
            <SecondaryGalleryCard key={gallery?._id} gallery={gallery} />
          ))}
        </div>
      </>
    );
  return (
    <>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 "
        id="gallery"
      >
        {displayedGalleries?.map((gallery) => (
          <PrimaryGalleryCard key={gallery?._id} gallery={gallery} />
        ))}
      </div>
    </>
  );
}
