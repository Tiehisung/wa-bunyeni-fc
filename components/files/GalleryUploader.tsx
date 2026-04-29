"use client";
import { useUploadGalleryMutation } from "@/services/upload.endpoints";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "../buttons/Button";
import { smartToast } from "@/utils/toast";
import Image from "next/image";

interface GalleryUploaderProps {
  onUploadSuccess?: (urls: string[]) => void;
  maxFiles?: number;
}

export function GalleryUploader({
  onUploadSuccess,
  maxFiles = 10,
}: GalleryUploaderProps) {
  const [uploadGallery, { isLoading }] = useUploadGalleryMutation();
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length + files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} files`);
      return;
    }

    // Add new files
    setFiles((prev) => [...prev, ...selectedFiles]);

    // Create previews
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await uploadGallery(formData).unwrap();
      smartToast(response);

      if (onUploadSuccess) {
        onUploadSuccess(response?.data?.map((f) => f.url) as string[]);
      }

      // Clear previews
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      toast.error("Failed to upload images");
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        disabled={isLoading}
        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
      />

      {previews.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <Image
                  width={400}
                  height={400}
                  src={preview as string}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <Button
            onClick={handleUpload}
            disabled={isLoading}
            primaryText={isLoading ? "Uploading..." : "Upload Gallery"}
            className="w-full"
          />
        </>
      )}
    </div>
  );
}
