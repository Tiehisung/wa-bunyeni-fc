"use client";

import { IFileProps } from "@/types/file.interface";
import { ReactNode, useState } from "react";
import LightboxViewer from "../viewer/LightBox";
import IMAGE from "../Image";
import { cn } from "@/lib/utils";
import { POPOVER } from "../ui/popover";
import { getThumbnail } from "@/lib/file";

interface MasonryGalleryProps {
  files: Array<IFileProps>;
  useSize?: boolean;
  enableLightboxViewer?: boolean;
  wrapperStyles?: string;
  className?: string;
  action?: (file: IFileProps) => ReactNode;
}

export default function MasonryGallery({
  files,
  useSize,
  enableLightboxViewer = true,
  wrapperStyles,
  className,
  action,
}: MasonryGalleryProps) {
  const [hoveredId, setHoveredId] = useState<string | undefined>(undefined);
  //For Lightbox
  const processedFiles = files
    .filter((f) => f.resource_type === "image" || f.type === "video")
    .map((item) => ({
      src: item?.secure_url,
      alt: item?.original_filename ?? (item?.public_id as string),
      width: item?.width,
      height: item?.height,
      type: item?.resource_type as "image" | "video",
    }));
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  function getAspectRatio(bytes: number): string {
    if (bytes > 500000) {
      return "aspect-[2/3]"; // tall
    } else if (bytes > 300000) {
      return "aspect-[3/4]"; // medium-tall
    } else if (bytes > 150000) {
      return "aspect-square"; // square
    } else {
      return "aspect-[4/3]"; // wide
    }
  }
  if (useSize)
    return (
      <div
        className={cn(
          "columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4",
          wrapperStyles,
        )}
      >
        {files?.map((file, i) => {
          return (
            <div
              key={file?.public_id + i}
              className={cn(
                "mb-6 break-inside-avoid overflow-hidden rounded-lg",
                className,
              )}
              onMouseEnter={() => setHoveredId(file?.public_id)}
              onMouseLeave={() => setHoveredId(undefined)}
              onClick={() => {
                setPhotoIndex(i);
                if (enableLightboxViewer) setOpen(true);
              }}
            >
              <div
                className={cn(
                  `group relative ${getAspectRatio(
                    file?.bytes as number,
                  )} w-full overflow-hidden bg-muted`,
                )}
              >
                <IMAGE
                  fallbackSrc={file.thumbnail_url ?? file.secure_url}
                  src={getThumbnail(file) as string}
                  alt={file?.original_filename ?? "img"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />

                <div
                  className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                    hoveredId === file?.public_id ? "opacity-40" : "opacity-20"
                  }`}
                />

                {file?.description && (
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/60 to-transparent px-4 py-6">
                    <p className="mt-1 text-sm text-gray-200 line-clamp-1">
                      {file?.description}
                    </p>
                  </div>
                )}

                {typeof action !== "undefined" && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <POPOVER
                      triggerClassNames="absolute right-1 top-1.5 rounded-full  "
                      variant={"secondary"}
                      size={"icon"}
                    >
                      {action(file)}
                    </POPOVER>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <LightboxViewer
          open={open}
          onClose={() => setOpen(false)}
          files={processedFiles}
          index={photoIndex}
        />
      </div>
    );

  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
      {files.map((file, i) => (
        <div
          key={file?.public_id + i}
          className={cn(
            "mb-6 break-inside-avoid overflow-hidden rounded-lg",
            className,
          )}
          onClick={() => {
            setPhotoIndex(i);
            if (enableLightboxViewer) setOpen(true);
          }}
        >
          <div className="group relative aspect-3/4 w-full overflow-hidden bg-muted">
            <img
              src={getThumbnail(file) as string}
              alt={file?.original_filename ?? (file?.public_id as string)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />

            <div className="absolute inset-0 bg-black transition-opacity duration-300 group-hover:opacity-40 opacity-20" />

            {file?.description && (
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/60 to-transparent px-4 py-6">
                <p className="mt-1 text-sm text-gray-200 line-clamp-1">
                  {file?.description}
                </p>
              </div>
            )}
            {typeof action !== "undefined" && (
              <div onClick={(e) => e.stopPropagation()}>
                <POPOVER
                  triggerClassNames="absolute right-1 top-1.5 rounded-full bg-muted"
                  variant={"ghost"}
                  size={"icon"}
                >
                  {action(file)}
                </POPOVER>
              </div>
            )}
          </div>
        </div>
      ))}
      <LightboxViewer
        open={open}
        onClose={() => setOpen(false)}
        files={processedFiles}
        index={photoIndex}
      />
    </div>
  );
}
