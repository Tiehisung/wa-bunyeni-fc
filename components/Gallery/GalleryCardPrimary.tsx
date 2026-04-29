"use client";

import LightboxViewer from "@/components/viewer/LightBox";
import { getThumbnail } from "@/lib/file";
import { formatDate } from "@/lib/timeAndDate";
import { IGallery } from "@/types/file.interface";
import { useState } from "react";
import { motion } from "framer-motion";
import { isObjectId } from "@/lib/validate";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { GalleryActions } from "./GalleryActions";
import { StackModal } from "../modals/StackModal";
import { EditGalleryUpload } from "./EditGallery";

interface GalleryCardProps {
  gallery: IGallery;
}

export function PrimaryGalleryCard({ gallery }: GalleryCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const thumbnail =
    gallery?.files?.find((f) => f?.resource_type === "image")?.secure_url ??
    getThumbnail(gallery?.files?.find((f) => f?.resource_type === "video"));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-video">
        <Image
          src={thumbnail as string}
          width={320}
          height={320}
          alt={gallery?.title as string}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          onClick={() => setIsOpen(true)}
        />

        {/* Admin dropdown menu */}

        <div
          className="absolute top-2 right-2 transition-opacity z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <GalleryActions gallery={gallery} onView={() => setIsOpen(true)} />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
          {gallery.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {gallery.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{gallery.files.length} items</span>
          <span>{formatDate(gallery.createdAt, "dd/mm/yyyy")}</span>
        </div>
        {(gallery?.tags?.length || 0) > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 ">
            {gallery?.tags
              ?.filter((t) => !isObjectId(t))
              ?.slice(0, 3)
              ?.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs font-light"
                >
                  #{tag}
                </Badge>
              ))}
            {(gallery?.tags?.length || 0) > 3 && (
              <span className="px-2 py-0.5 text-xs text-muted-foreground">
                +{(gallery?.tags?.length || 0) - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <LightboxViewer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        files={
          gallery?.files
            ?.filter((f) => f?.resource_type === "image" || f?.type === "video")
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

      <StackModal title={'Edit Gallery'} description={gallery?.description} id={ gallery?._id as string} closeOnEsc>
        <EditGalleryUpload gallery={gallery} />
      </StackModal>
    </motion.div>
  );
}
