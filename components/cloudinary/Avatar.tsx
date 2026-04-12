"use client";

import { useEffect, useState } from "react";
import { Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICloudinaryFile } from "@/types/file.interface";
import { useUploadImageMutation } from "@/services/upload.endpoints";
import { smartToast } from "@/utils/toast";
import { bytesToMB } from "@/lib";

interface AvatarUploadWidgetProps {
  onUpload: (result: ICloudinaryFile) => void;
  onRemove?: () => void;
  folder?: string;
  maxSize?: number;
  initialImage?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "square" | "rounded";
  showUploadButton?: boolean;
  uploadButtonText?: string;
  name: string;
}

export const AvatarUploader = ({
  onUpload,
  onRemove,
  folder = "avatars",
  initialImage,
  className = "",
  size = "md",
  shape = "circle",
  showUploadButton = true,
  uploadButtonText = "Upload Photo",
  maxSize = 1000 * 1000 * 5,
  name = "avatar",
}: AvatarUploadWidgetProps) => {
  const [upload, { isLoading, isSuccess }] = useUploadImageMutation();

  const [previewImage, setPreviewImage] = useState<string | undefined>(
    initialImage,
  );

  // Size mappings
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  };

  // Shape mappings
  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-none",
    rounded: "rounded-lg",
  };

  // Update preview when initialImage changes
  useEffect(() => {
    setPreviewImage(initialImage);
  }, [initialImage]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = event.target.files ? event.target.files[0] : null;
      if (!file) {
        smartToast({
          message: ` File not selected `,
          success: false,
        });
        return;
      }
      if (file.size > maxSize) {
        smartToast({
          message: ` File should not exceed ${bytesToMB(maxSize)}`,
          success: false,
        });
        return;
      }

      const fileString = URL.createObjectURL(file);

      //Now Upload
      if (fileString) {
        const formdata = new FormData();
        formdata.append("image", file);
        formdata.append("folder", folder);
        const result = await upload(formdata).unwrap();

        smartToast(result);

        if (!result.success) return;

        setPreviewImage(result.data?.secure_url);
        onUpload(result.data as ICloudinaryFile);
      }
    } catch (error) {
      smartToast({ error });
    }
  }

  const handleRemove = () => {
    setPreviewImage(undefined);
    onRemove?.();
    const input = document.getElementById(name) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Avatar Preview */}
      <div className="relative group">
        <div
          className={cn(
            "relative overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-md bg-gray-100 dark:bg-gray-800",
            sizeClasses[size],
            shapeClasses[shape],
          )}
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Camera size={size === "sm" ? 20 : size === "md" ? 24 : 32} />
            </div>
          )}

          {/* Hover overlay */}
          <label
            htmlFor={name}
            className={cn(
              "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
              isLoading && "cursor-not-allowed",
            )}
            title={isSuccess ? "Upload new photo" : "Loading..."}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera className="text-white" size={size === "sm" ? 16 : 20} />
            )}

            <input
              id={name}
              hidden
              type="file"
              onChange={handleUpload}
              name="image"
              className=""
              accept={"image/*"}
              disabled={isLoading}
            />
          </label>
        </div>

        {/* Remove button - only shown when image exists */}
        {previewImage && (
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition hover:bg-red-600 shadow-lg z-10"
            title="Remove image"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Upload Button */}

      <label
        htmlFor={name}
        hidden={!showUploadButton}
        className={cn(
          "text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors",
          isLoading && "opacity-50 cursor-not-allowed",
        )}
      >
        {isLoading
          ? "Uploading..."
          : previewImage
            ? "Change Photo"
            : uploadButtonText}
      </label>
    </div>
  );
};
