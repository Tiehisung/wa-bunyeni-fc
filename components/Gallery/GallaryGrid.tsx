import { IGallery } from "@/types/file.interface";
import { SecondaryGalleryCard } from "./GalleryCardSecondary";
import { PrimaryGalleryCard } from "./GalleryCardPrimary";
import { StackModal } from "../modals/StackModal";
import { EditGalleryUpload } from "./EditGallery";

interface GalleryGridProps {
  galleries: IGallery[];
  showDate?: boolean;
  card?: "primary" | "secondary";
}

export default function GalleryGrid({
  galleries,
  card = "primary",
}: GalleryGridProps) {
  if (!galleries?.length) {
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
          {galleries?.map((gallery) => (
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
          {galleries?.map((gallery) => (
            <PrimaryGalleryCard key={gallery?._id} gallery={gallery} />
          ))}
        </div>
      </>
    );
}
