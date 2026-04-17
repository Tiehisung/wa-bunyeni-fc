"use client";

import { ENV } from "@/lib/env";
import { IGallery } from "@/types/file.interface";
import { downloadGalleryAsZip } from "@/utils/download.utils";
import { View, Download, Trash } from "lucide-react";
import { ConfirmDialog } from "../ConfirmDialog";
import { PrimaryDropdown } from "../Dropdown";
import SocialShare from "../SocialShare";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useDeleteGalleryMutation } from "@/services/gallery.endpoints";
import { useSession } from "next-auth/react";
import { smartToast } from "@/utils/toast";

export const GalleryActions = ({
  gallery,
  onView,
}: {
  gallery?: IGallery;
  onView?: () => void;
}) => {
  const { data: session } = useSession();
  const [deleteGallery, { isLoading: isDeleting }] = useDeleteGalleryMutation();
  const handleDelete = async (galleryId: string) => {
    try {
      const result = await deleteGallery(galleryId).unwrap();
      
      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  const isAdmin = session?.user?.role?.includes("admin");

  return (
    <PrimaryDropdown variant={"outline"}>
      <DropdownMenuItem onClick={onView}>
        <View className="w-4 h-4 mr-2" /> View
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => downloadGalleryAsZip(gallery as IGallery)}
      >
        <Download className="w-4 h-4 mr-2" /> Download
      </DropdownMenuItem>

      {isAdmin && (
        <ConfirmDialog
          trigger={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="grow "
            >
              <Trash className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          }
          triggerStyles="justify-start w-full p-0 font-normal"
          onConfirm={() => handleDelete(gallery?._id as string)}
          variant="ghost"
          title={`Delete Document`}
          description={`Are you sure you want to delete <b>"${gallery?.title}"</b>?`}
          isLoading={isDeleting}

        />
      )}

      <SocialShare
        url={`${ENV.APP_URL}/gallery?stackModal=${gallery?._id}`}
        label="Share with others"
        className="justify-start"
      />
    </PrimaryDropdown>
  );
};
