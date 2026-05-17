"use client";

import MasonryGallery from "@/components/Gallery/Masonry";
import { IPlayer } from "@/types/player.interface";
import { ICloudinaryFile, IFileProps } from "@/types/file.interface";

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

interface Props {
  slug?: string;
}

export function MatchFeaturedImages({ slug }: Props) {
  const { data: matchData, isLoading, error } = useGetMatchQuery(slug!);
  const match = matchData?.data;
  const router = useRouter();

  const { data: session } = useSession();
  const isAuthorized = session?.user?.role?.includes("admin");
  const [updateMatch, { isLoading: updatingMatch }] = useUpdateMatchMutation();

  const handleSaveMedia = async (imageFile: string) => {
    if (!imageFile || !match?._id) return;

    try {
      const result = await updateMatch({
        _id: match._id,
        matchImages: [imageFile, ...(match?.matchImages ?? [])].filter(Boolean),
      }).unwrap();

      smartToast(result);
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
        matchImages: [
          file,
          ...(match?.matchImages?.filter((m) => m !== file) ?? []),
        ],
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
        matchImages: match?.matchImages?.filter((m) => m !== file) ?? [],
      }).unwrap();

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <div className=" grow min-h-44 my-10 w-full">
      {isAuthorized && (
        <>
          <h3 className="text-lg font-semibold mb-4">Featured Media</h3>
          <div
            className={cn(
              " flex flex-col items-center justify-center gap-6 my-6 border-t pt-3",
              updatingMatch ? "pointer-events-none hidden" : "",
            )}
          >
            <CloudinaryWidget
              onUploadSuccess={(fs) => handleSaveMedia(fs?.[0]?.secure_url)}
              maxFiles={1}
              multiple={false}
              trigger={"Add Feature Media"}
              cropping
            />
          </div>
        </>
      )}

      {match?.matchImages?.length ? (
        <MasonryGallery
          files={
            (match?.matchImages?.map((mi) => ({
              secure_url: mi,
              resource_type: "image",
            })) as IFileProps[]) ?? []
          }
          // useSize
          action={(f) =>
            isAuthorized ? (
              <div className="space-y-1.5">
                <Button
                  onClick={() => handleSetWallpaper(f?.secure_url)}
                  primaryText="Set as Wallpaper"
                  waitingText="Finalizing..."
                  variant="secondary"
                  className="w-full justify-start"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleDeleteMedia(f?.secure_url)}
                  primaryText="Delete"
                  waitingText="Wait..."
                  variant="secondary"
                  className="w-full justify-start"
                  disabled={isLoading}
                />
              </div>
            ) : undefined
          }
        />
      ) : null}
    </div>
  );
}
