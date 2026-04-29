"use client";

import { IGallery } from "@/types/file.interface";

import Loader from "@/components/loaders/Loader";
import { useGetGalleriesQuery } from "@/services/gallery.endpoints";
import { PrimaryGalleryCard } from "../../../../components/Gallery/GalleryCardPrimary";

interface GalleryDisplayProps {
  galleries?: IGallery[]; // Make optional since we might fetch internally
}

export function GalleryDisplay({
  galleries: propGalleries,
}: GalleryDisplayProps) {
  // Fetch galleries if not provided via props
  const { data: fetchedGalleries, isLoading } = useGetGalleriesQuery(
    undefined,
    {
      skip: !!propGalleries, // Skip if galleries provided via props
    },
  );

  // Use props if provided, otherwise use fetched data
  const galleries = propGalleries || fetchedGalleries?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-50">
        <Loader message="Loading galleries..." />
      </div>
    );
  }

  if (!galleries?.length) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No galleries uploaded yet.
      </p>
    );
  }

  return (
    <>
     
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {galleries.map((gallery) => (
          <PrimaryGalleryCard gallery={gallery} key={gallery._id} />
        ))}
      </div>


    </>
  );
}

 
