"use client";

import GalleryClient from "./GalClient";
import InfiniteLimitScroller from "@/components/InfiniteScroll";
import { IntroSection } from "@/components/IntroSection";
import { staticImages } from "@/assets/images";
import { GrGallery } from "react-icons/gr";

import Loader from "@/components/loaders/Loader";
import { useGetGalleriesQuery } from "@/services/gallery.endpoints";
import { useSearchParams } from "next/navigation";
import DataErrorAlert from "@/components/error/DataError";
import { sParamsToObject } from "@/lib/searchParams";

const GalleryPage = () => {
  const searchParams = useSearchParams();

  const {
    data: galleries,
    isLoading: galleriesLoading,
    error: galleriesError,
  } = useGetGalleriesQuery(sParamsToObject(searchParams), {});

  const isLoading = galleriesLoading;

  const featureImage =
    galleries?.data?.[0]?.files?.find((f) => f.resource_type === "image")
      ?.secure_url ?? staticImages.ballOnGrass;

  if (isLoading) {
    return <Loader message="Loading gallery..." />;
  }

  if (galleriesError && !galleries) {
    return <DataErrorAlert message={galleriesError} />;
  }

  return (
    <div>
      <IntroSection
        image={featureImage as string}
        title="Gallery"
        subtitle="Capture and relive your best moments"
        icon={<GrGallery />}
        className="rounded-b-2xl py-6"
      />
      <GalleryClient galleries={galleries} />
      <InfiniteLimitScroller pagination={galleries?.pagination} />
    </div>
  );
};

export default GalleryPage;
