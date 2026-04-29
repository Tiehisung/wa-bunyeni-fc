"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/buttons/Button";
import { Input } from "@/components/input/Inputs";
import { IGallery } from "@/types/file.interface";
import { IPlayer } from "@/types/player.interface";
import MultiSelectionInput from "../select/MultiSelect";
import { ICloudinaryFile } from "@/types/file.interface";
import { smartToast } from "@/utils/toast";
import { useUpdateGalleryMutation } from "@/services/gallery.endpoints";
import Image from "next/image";
import { Edit, X } from "lucide-react";
import { DIALOG } from "../Dialog";
import { fireEscape } from "@/hooks/Esc";

interface GalleryUploadProps {
  tags?: string[];
  players?: IPlayer[];
  gallery?: IGallery;
}

export function EditGalleryUpload({
  tags = [],
  players = [],
  gallery,
}: GalleryUploadProps) {
  const [updateGallery, { isLoading: isUpdating }] = useUpdateGalleryMutation();

  const [files, setFiles] = useState<ICloudinaryFile[]>(gallery?.files || []);
  const [description, setDescription] = useState(gallery?.description || "");
  const [title, setTitle] = useState(gallery?.title ?? "");
  const [taggedPlayers, setTaggedPlayers] = useState<string[]>(
    gallery?.tags || [],
  );

 
  /** Handle gallery save */
  const handleSave = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("Please upload at least one file.");
      return;
    }

    try {
      const payload: IGallery = {
        title,
        description,
        files: files.map((file) => ({
          ...file,
          tags: [...tags].filter(Boolean),
        })),
        tags: [
          ...tags,
          ...taggedPlayers.map((t) => t.split(",").flat()).flat(),
        ].filter(Boolean),
        type: "general",
        _id: gallery?._id,
      };

      const result = await updateGallery(payload).unwrap();

      if (result.success) fireEscape();

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <>
      <div className="w-full rounded-xl bg-card/30  space-y-8 p-4 mb-4">
          {files.length > 0 && (
            <form
              onSubmit={handleSave}
              className="flex flex-col gap-6 md:gap-8 max-w-2xl mx-auto"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {files?.map((gf, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition"
                  >
                    <Image
                      src={gf?.secure_url}
                      alt={`${gf?.original_filename}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    <Button
                      className="absolute right-2 top-2 rounded-full"
                      variant="destructive"
                      size="icon"
                      onClick={() =>
                        setFiles((p) =>
                          p.filter((f) => f.public_id !== gf?.public_id),
                        )
                      }
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {files.length} file{files.length !== 1 ? "s" : ""} 
              </p>

              <div className="flex flex-col gap-4">
                <Input
                  onChange={(e) => setTitle(e.target.value)}
                  name="title"
                  label="Title"
                  value={title}
                  placeholder="Gallery title"
                />
                <Input
                  onChange={(e) => setDescription(e.target.value)}
                  name="description"
                  label="Comment"
                  value={description}
                  placeholder="Description"
                />
              </div>

              {players?.length > 0 && (
                <div className="w-full">
                  <p className="_label mb-2">Tag Players</p>
                  <MultiSelectionInput
                    onChange={(ts) => setTaggedPlayers(ts.map((t) => t.value))}
                    options={players?.map((p) => ({
                      label: `${p.lastName} ${p.firstName}`,
                      value: `${p._id},${p.lastName} ${p.firstName}`,
                    }))}
                    className="text-sm"
                    label=""
                    name={"tags"}
                  />
                </div>
              )}

              <div className="flex justify-center">
                <Button
                  type="submit"
                  waiting={isUpdating}
                  waitingText="Saving..."
                  primaryText="Save Gallery"
                  className=" w-48 justify-center"
                  size="lg"
                />
              </div>
            </form>
          )}
        </div>
    </>
  );
}
