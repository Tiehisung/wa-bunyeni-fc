"use client";

import { useMemo, useState } from "react";
import LightboxViewer from "@/components/viewer/LightBox";
import { IQueryResponse } from "@/types";
import { IGallery } from "@/types/file.interface";
import { shortText } from "@/lib";
import { PrimarySearch } from "@/components/Search";
import { ClearFiltersBtn } from "@/components/buttons/ClearFilters";
import { getThumbnail } from "@/lib/file";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { GalleryActions } from "@/components/Gallery/GalleryActions";
import { StackModal } from "@/components/modals/StackModal";
import { ImagesIcon } from "lucide-react";
import { toggleClick } from "@/lib/dom";

type Props = {
  galleries?: IQueryResponse<IGallery[]>;
  className?: string;
  startIndex?: number;
};

export default function GalleryClient({ galleries, className = "" }: Props) {
  return (
    <div className={`p-3 ${className}`}>
      <div className="flex items-center gap-2 justify-between my-6 _page">
        <PrimarySearch
          placeholder="Search Gallery"
          inputStyles="h-9"
          className="bg-secondary w-fit focus-within:grow"
          searchKey="gallery_search"
        />
        <ClearFiltersBtn className=" p-1.5 rounded-md h-9 " />
      </div>
      {/* Grid */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {galleries?.data?.map((gallery, i) => (
          <GalleryThumbnail
            key={`gallery${i}`}
            gallery={gallery}
            className="max-h-72 rounded-none bg-modalOverlay"
          />
        ))}
      </div>
    </div>
  );
}

export type GalleryImage = {
  src: string;
  width?: number;
  height?: number;
  title?: string;
  description?: string;
};

type GalleryProps = {
  gallery: IGallery;
  className?: string;
};

export function GalleryThumbnail({ gallery, className = "" }: GalleryProps) {
  const [open, setOpen] = useState(false);

  // Prepare slides for lightbox
  const files = useMemo(
    () =>
      gallery?.files
        ?.filter(
          (f) => f.resource_type == "image" || f.resource_type == "video",
        )
        ?.map((file) => ({
          src: file.secure_url,
          width: file.width ?? 1600,
          height: file.height ?? 900,
          title: shortText(file?.original_filename ?? "Image", 20),
          description: file.description,
          type: file.resource_type as "image" | "video",
        })),
    [gallery],
  );

  const thumbnailFile =
    gallery?.files?.find((f) => f.resource_type == "image") ??
    gallery?.files?.[0];

  const thumbnail_url = getThumbnail(thumbnailFile);

  return (
    <>
      <div
        onClick={() => {
          setOpen(true);
        }}
        className={cn(
          `relative overflow-hidden rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary w-full h-auto `,
          className,
        )}
        aria-label={thumbnailFile?.original_filename ?? `Open image`}
      >
        <div className="relative w-full h-full min-h-80 aspect-4/5 bg-gray-100 flex items-start">
          <Image
            src={thumbnail_url as string}
            width={400}
            height={400}
            alt={thumbnailFile?.original_filename ?? `Gallery Image `}
            className="object-cover transform transition-transform duration-300 hover:scale-105 grow h-full "
          />
        </div>

        {/* overlay */}
        <div className="absolute bottom-0 right-0 left-0 flex items-center justify-between gap-2 p-2 h-fit bg-linear-to-b from-transparent to-modalOverlay/30 text-white">
          <div className=" text-xs  rounded px-2 py-1 line-clamp-1">
            {shortText(
              (gallery?.title as string) ??
                gallery?.description ??
                thumbnailFile?.original_filename,
              32,
            )}
          </div>
          {files.length > 1 && (
            <span className="border border-muted/5 rounded-full  text-xs font-thin p-0.5">
              +{files?.length - 1}
            </span>
          )}
        </div>

        <div
          className="absolute top-2 right-2 transition-opacity z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <GalleryActions gallery={gallery} onView={() => toggleClick(gallery?._id as string)} />
        </div>
      </div>

      {/* Lightbox */}
      <LightboxViewer
        open={open}
        onClose={() => setOpen(false)}
        files={files ?? []}
        index={0}
      />

      <StackModal id={gallery?._id as string}>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ImagesIcon className="w-5 h-5" />
          Gallery ({gallery?.files?.length})
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery?.files?.map((gf, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition"
            >
              <Image
                src={gf?.secure_url}
                alt={`${gf?.original_filename}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </ div>
          ))}
        </div>
      </StackModal>
    </>
  );
}
