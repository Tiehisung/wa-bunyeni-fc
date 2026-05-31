"use client";

import MasonryGallery from "@/components/Gallery/Masonry";
import { IFileProps } from "@/types/file.interface";
import { Button } from "@/components/buttons/Button";
import { CloudinaryWidget } from "@/components/cloudinary/Cloudinary";
import { smartToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import {
  useGetMatchQuery,
  useUpdateMatchMutation,
} from "@/services/match.endpoints";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { downloadFile } from "@/lib/file";
import { Download, Trash, Wallpaper } from "lucide-react";

interface Props {
  slug?: string;
}

export function MatchFeaturedImages({ slug }: Props) {
  const { data: matchData, isLoading, refetch } = useGetMatchQuery(slug!);
  const match = matchData?.data;
  const router = useRouter();

  console.log({match})

  const { data: session } = useSession();
  const isAuthorized = session?.user?.role?.includes("admin");
  const [updateMatch, { isLoading: updatingMatch }] = useUpdateMatchMutation();

  const handleSaveMedia = async (imageFile: string) => {
    if (!imageFile || !match?._id) return;

    try {
      const result = await updateMatch({
        _id: match._id,
        images: [imageFile, ...(match?.images ?? [])].filter(Boolean),
      }).unwrap();

      smartToast(result);
      refetch();
    } catch (error) {
      smartToast({ error });
    } finally {
      router.refresh();
    }
  };

  const handleSetWallpaper = async (file: string) => {
    if (!match?._id) return;

    try {
      const result = await updateMatch({
        _id: match._id,
        images: [file, ...(match?.images?.filter((m) => m !== file) ?? [])],
      }).unwrap();

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  const handleDeleteMedia = async (file: string) => {
    if (!match?._id) return;

    try {
      const result = await updateMatch({
        _id: match._id,
        images: match?.images?.filter((m) => m !== file) ?? [],
      }).unwrap();

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <div className=" grow min-h-44 my-10 w-full">
      <div className="flex items-center gap6 justify-between border-b pb-4 mb-5 ">
        <h3 className="text-lg font-semibold mb-4">Featured Media</h3>
        {isAuthorized && (
          <div
            className={cn(updatingMatch ? "pointer-events-none hidden" : "")}
          >
            <CloudinaryWidget
              onUploadSuccess={(fs) => handleSaveMedia(fs?.[0]?.secure_url)}
              maxFiles={1}
              multiple={false}
              trigger={"Add Feature Media"}
              cropping
            />
          </div>
        )}
      </div>

      {match?.images?.length ? (
        <MasonryGallery
          files={
            (match?.images?.map((mi) => ({
              secure_url: mi,
              resource_type: "image",
            })) as IFileProps[]) ?? []
          }
          // useSize
          action={(f) => (
            <div className="space-y-1.5">
              {isAuthorized && (
                <Button
                  onClick={() => handleSetWallpaper(f?.secure_url)}
                  waitingText="Finalizing..."
                  variant="secondary"
                  className="w-full justify-start"
                  disabled={isLoading}
                >
                  <Wallpaper />
                  Set as Wallpaper
                </Button>
              )}
              {isAuthorized && (
                <Button
                  onClick={() => handleDeleteMedia(f?.secure_url)}
                  waitingText="Wait..."
                  variant="secondary"
                  className="w-full justify-start"
                  disabled={isLoading}
                >
                  <Trash />
                  Delete
                </Button>
              )}
              <Button
                onClick={() =>
                  downloadFile(f?.secure_url, `${match.title} feature file`)
                }
                waitingText="Wait..."
                variant="secondary"
                className="w-full justify-start"
                disabled={isLoading}
              >
                <Download />
                Download
              </Button>
            </div>
          )}
        />
      ) : null}
    </div>
  );
}
