"use client";

import MasonryGallery from "@/components/Gallery/Masonry";
import { IPlayer } from "@/types/player.interface";
import { useState } from "react";
import { ICloudinaryFile, IFileProps } from "@/types/file.interface";
import { useUpdatePlayerMutation } from "@/services/player.endpoints";

import { Button } from "@/components/buttons/Button";
import { CloudinaryWidget } from "@/components/cloudinary/Cloudinary";
import { smartToast } from "@/utils/toast";

export function PlayerFeatureMedia({ player }: { player?: IPlayer }) {
  const [uploadedFile, setUploadedFile] = useState<ICloudinaryFile | null>(
    null,
  );
  const [updatePlayer, { isLoading }] = useUpdatePlayerMutation();

  const handleSaveMedia = async () => {
    if (!uploadedFile || !player?._id) return;

    try {
      const result = await updatePlayer({
        _id: player._id,
        featureMedia: [uploadedFile, ...(player?.featureMedia ?? [])].filter(
          Boolean,
        ),
      }).unwrap();

      if (result.success) {
        setUploadedFile(null);
      }
      smartToast(result);
    } catch (error) {
      smartToast({ error });
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
    <div className="p-6 grow min-h-44 my-10 w-full">
      <h3 className="text-lg font-semibold mb-4">Featured Media</h3>
      <div className="flex flex-col items-center justify-center gap-6 my-6 border-t pt-3">
        <CloudinaryWidget
          onUploadSuccess={(fs) => setUploadedFile(fs?.[0])}
          maxFiles={1}
          multiple={false}
          trigger={"Add Feature Media"}
          cropping
        />

        {uploadedFile && (
          <Button
            onClick={handleSaveMedia}
            primaryText="SAVE MEDIA"
            waitingText="SAVING..."
            className="w-52 justify-center"
            disabled={isLoading}
          />
        )}
      </div>

      {player?.featureMedia?.length ? (
        <MasonryGallery
          files={(player?.featureMedia as IFileProps[]) ?? []}
          // useSize
          action={(f) => (
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
          )}
        />
      ) : null}
    </div>
  );
}
