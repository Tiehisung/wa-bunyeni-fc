"use client";

import { GalleryUpload } from "@/components/Gallery/GalleryUpload";
import { GalleryDisplay } from "./DisplayGal";
import { SearchGallery } from "./Search";
import InfiniteLimitScroller from "@/components/InfiniteScroll";
 
import Loader from "@/components/loaders/Loader";
import { useGetGalleriesQuery } from "@/services/gallery.endpoints";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import DataErrorAlert from "@/components/error/DataError";
import TableLoader from "@/components/loaders/Table";
import { useSearchParams } from "next/navigation";

export default function GalleriesAdmin() {
  const  searchParams  = useSearchParams();
  const queryString = searchParams.toString()
    ? `?${searchParams.toString()}`
    : "";

  // Fetch galleries with query params
  const {
    data: galleries,
    isLoading: galleriesLoading,
    error: galleriesError,
    isFetching,
  } = useGetGalleriesQuery(queryString);

  // Fetch players for tagging
  const { data: players, isLoading: playersLoading } = useGetPlayersQuery("");

  const isLoading = galleriesLoading || playersLoading;

  if (isLoading) {
    return <TableLoader className="h-32" rows={2} cols={2} />;
  }

  if (galleriesError) return <DataErrorAlert message={galleriesError} />;

  return (
    <div className="pt-16 _page">
      <GalleryUpload players={players?.data} trigger="Upload Files" />

      <br />

      <SearchGallery players={players?.data} />

      <GalleryDisplay galleries={galleries?.data ?? []} />

      <InfiniteLimitScroller
        pagination={galleries?.pagination}
        endDataText="No more galleries"
      />

      {isFetching && (
        <div className="fixed bottom-4 right-4">
          <Loader size="sm" message="Updating..." />
        </div>
      )}
    </div>
  );
}
