 "use client";


import { formatDate } from "@/lib/timeAndDate";
import { isObjectId } from "@/lib/validate";
import { IGallery } from "@/types/file.interface";
import { useState } from "react";
import { MediaPreview } from "../files/MediaView";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import LightboxViewer from "../viewer/LightBox";
import { Badge } from "../ui/badge";

export function SecondaryGalleryCard({
  gallery,
  showDate,
  onClick,
}: {
  gallery?: IGallery;
  showDate?: boolean;
  onClick?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Card
        key={gallery?._id}
        className="cursor-pointer hover:shadow-lg transition-all duration-200 rounded-none"
        onClick={onClick}
      >
        <CardHeader>
          <CardTitle className="flex flex-wrap justify-between items-center gap-2">
            <span className="font-semibold line-clamp-2">
              {gallery?.title || "Untitled Gallery"}
            </span>

            {showDate && gallery?.createdAt && (
              <span className="text-xs text-muted-foreground">
                {formatDate(gallery?.createdAt, "March 2, 2025")}
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent
          className="space-y-3"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          {/* Media grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {gallery?.files?.slice(0, 6)?.map((file) => (
              <MediaPreview key={file?._id} file={file} />
            ))}

            {(gallery?.files?.length ?? 0) > 6 && (
              <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-semibold text-muted-foreground">
                +{(gallery?.files?.length ?? 0) - 6} more
              </div>
            )}
          </div>

          {/* Description */}
          {gallery?.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {gallery?.description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1 font-light text-sm">
            {gallery?.tags
              ?.filter((t) => !isObjectId(t))
              ?.slice(0, 10)
              ?.map((tag, index) => (
                <Badge key={index} variant='outline'>
                  #{tag}
                </Badge>
              ))}
          </div>
        </CardContent>
      </Card>
      <LightboxViewer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        files={
          gallery?.files
            ?.filter(
              (f) => f?.resource_type == "image" || f.resource_type == "video"
            )
            ?.map((f) => ({
              src: f.secure_url,
              alt: f.original_filename,
              height: f.height,
              width: f.width,
              type: f.resource_type as "image" | "video",
            })) ?? []
        }
        index={0}
      />
    </>
  );
}
