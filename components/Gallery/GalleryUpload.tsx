"use client";

import { useState, useCallback, ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/buttons/Button";
import { Input } from "@/components/input/Inputs";
import { IGallery } from "@/types/file.interface";
import { IPlayer } from "@/types/player.interface";
import MultiSelectionInput from "../select/MultiSelect";
import { ICloudinaryFile } from "@/types/file.interface";
import { smartToast } from "@/utils/toast";
import { useCreateGalleryMutation } from "@/services/gallery.endpoints";
import { CloudinaryWidget } from "../cloudinary/Cloudinary";

interface GalleryUploadProps {
  tags?: string[];
  players?: IPlayer[];
  trigger?: ReactNode;
}

export function GalleryUpload({
  tags = [],
  players = [],
  trigger = "Create Gallery",
}: GalleryUploadProps) {
  const [createGallery, { isLoading }] = useCreateGalleryMutation();

  const [files, setFiles] = useState<ICloudinaryFile[]>([]);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [taggedPlayers, setTaggedPlayers] = useState<string[]>([]);

  /** Reset form state */
  const resetForm = useCallback(() => {
    setDescription("");
    setTitle("");
    setFiles([]);
    setTaggedPlayers([]);
    // setClearTrigger((n) => n + 1);
  }, []);

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
      };

      const result = await createGallery(payload).unwrap();

      if (result.success) resetForm();

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <>
      <div className="w-full border border-border rounded-xl bg-card/30 shadow-sm space-y-8 p-4 mb-4">
        <CloudinaryWidget
          onUploadSuccess={setFiles}
          maxFiles={16}
          trigger={trigger}
          variant={"outline"}
        />
        {files.length > 0 && (
          <form
            onSubmit={handleSave}
            className="flex flex-col gap-6 md:gap-8 max-w-2xl mx-auto"
          >
            <p className="text-sm text-muted-foreground text-center">
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </p>

            <div className="flex flex-col gap-4">
              <Input
                onChange={(e) => setTitle(e.target.value)}
                name="title"
                value={title}
                placeholder="Gallery title"
              />
              <Input
                onChange={(e) => setDescription(e.target.value)}
                name="description"
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
                waiting={isLoading}
                waitingText="Saving..."
                primaryText="Save Gallery"
                className="_primaryBtn w-48 h-10 justify-center"
              />
            </div>
          </form>
        )}
      </div>
    </>
  );
}
