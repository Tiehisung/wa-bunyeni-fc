"use client";

import { PrimaryDropdown } from "@/components/Dropdown";
import LightboxViewer from "@/components/viewer/LightBox";
import { downloadFile, getThumbnail } from "@/lib/file";
import { formatDate } from "@/lib/timeAndDate";
import { IGallery } from "@/types/file.interface";
import { Download, Trash, View } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { ConfirmActionButton } from "@/components/buttons/ConfirmAction";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDeleteGalleryMutation } from "@/services/gallery.endpoints";
import { smartToast } from "@/utils/toast";
import { isObjectId } from "@/lib/validate";
import { Badge } from "../ui/badge";
import { useAppSelector } from "@/store/hooks/store";

interface GalleryCardProps {
  gallery: IGallery;
}

export function PrimaryGalleryCard({ gallery }: GalleryCardProps) {
  const { user } = useAppSelector((s) => s.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteGallery, { isLoading: isDeleting }] = useDeleteGalleryMutation();
  const handleDelete = async (galleryId: string) => {
    try {
      const result = await deleteGallery(galleryId).unwrap();
      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  const isAdmin = user?.role?.includes("admin");

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
        <img
          src={thumbnail as string}
          alt={gallery.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          onClick={() => setIsOpen(true)}
        />

        {/* Admin dropdown menu */}
        {isAdmin && (
          <div className="absolute top-2 right-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
            <PrimaryDropdown>
              <DropdownMenuItem onClick={() => setIsOpen(true)}>
                <View className="w-4 h-4 mr-2" /> View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  downloadFile(
                    gallery.files[0]?.secure_url,
                    gallery.files[0]?.original_filename as string,
                  )
                }
              >
                <Download className="w-4 h-4 mr-2" /> Download
              </DropdownMenuItem>
              <ConfirmActionButton
                onConfirm={() => handleDelete(gallery?._id as string)}
                trigger={
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="grow "
                  >
                    <Trash className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                }
                variant={"ghost"}
                triggerStyles="w-full justify-start p-0 "
                title="Delete Gallery"
                confirmText="Are you sure you want to delete this gallery?"
                // variant="destructive"
                confirmVariant={"delete"}
                isLoading={isDeleting}
              />
            </PrimaryDropdown>
          </div>
        )}
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
    </motion.div>
  );
}
