"use client";

import MasonryGallery from "@/components/Gallery/Masonry";
import { IPlayer } from "@/types/player.interface";
import { ICloudinaryFile, IFileProps } from "@/types/file.interface";
import { useUpdatePlayerMutation } from "@/services/player.endpoints";

import { Button } from "@/components/buttons/Button";
import { CloudinaryWidget } from "@/components/cloudinary/Cloudinary";
import { smartToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Props {
  player?: IPlayer;
  isAuthorized?: boolean;
}

export function PlayerFeatureMedia({ player, isAuthorized }: Props) {
  const { data: session } = useSession();
  const user = session?.user;

  const router = useRouter();
  const [updatePlayer, { isLoading }] = useUpdatePlayerMutation();

  const handleSaveMedia = async (imageFile: ICloudinaryFile) => {
    if (!imageFile || !player?._id) return;

    try {
      const result = await updatePlayer({
        _id: player._id,
        featureMedia: [imageFile, ...(player?.featureMedia ?? [])].filter(
          Boolean,
        ),
      }).unwrap();

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    } finally {
      router.refresh();
    }
  };

  const handleSetWallpaper = async (file: ICloudinaryFile) => {
    if (!player?._id) return;

    try {
      const result = await updatePlayer({
        _id: player._id,
        featureMedia: [
          file,
          ...(player?.featureMedia?.filter(
            (m) => m.public_id !== file.public_id,
          ) ?? []),
        ],
      }).unwrap();

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  const handleDeleteMedia = async (file: ICloudinaryFile) => {
    if (!player?._id) return;

    try {
      const result = await updatePlayer({
        _id: player._id,
        featureMedia:
          player?.featureMedia?.filter((m) => m.public_id !== file.public_id) ??
          [],
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
          <div className="flex flex-col items-center justify-center gap-6 my-6 border-t pt-3">
            <CloudinaryWidget
              onUploadSuccess={(fs) => handleSaveMedia(fs?.[0])}
              maxFiles={1}
              multiple={false}
              trigger={"Add Feature Media"}
              cropping
            />
          </div>
        </>
      )}

      {player?.featureMedia?.length ? (
        <MasonryGallery
          files={(player?.featureMedia as IFileProps[]) ?? []}
          // useSize
          action={(f) =>
            isAuthorized ? (
              <div className="space-y-1.5">
                <Button
                  onClick={() => handleSetWallpaper(f)}
                  primaryText="Set as Wallpaper"
                  waitingText="Finalizing..."
                  variant="secondary"
                  className="w-full justify-start"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleDeleteMedia(f)}
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
