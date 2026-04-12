'use client'

import { cn } from "@/lib/utils";
import { ReactNode, useState, useCallback, useRef } from "react";
import { useUploadImageMutation } from "@/services/upload.endpoints";
import { Button } from "../buttons/Button";
import { smartToast } from "@/utils/toast";
import { Label } from "../ui/label";
import { X, Upload, Image as ImageIcon,   } from "lucide-react";
import { OverlayLoader } from "../loaders/OverlayLoader";

interface IProps {
  onUpload: (url: string) => void;
  folder?: string;
  initialImage?: string;
  label?: ReactNode;
  className?: string;
  maxSize?: number; // in MB
  aspectRatio?: "square" | "video" | "portrait" | "auto";
}

export function ImageUploader({
  onUpload,
  folder = "/media/images",
  initialImage,
  label,
  className,
  maxSize = 5,
  aspectRatio = "square",
}: IProps) {
  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const [preview, setPreview] = useState<string | undefined>(initialImage);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "aspect-auto",
  };

  const handleFileChange = useCallback(
    async (file: File) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        smartToast({ error: "Please upload a valid image file" });
        return;
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        smartToast({ error: `File size must be less than ${maxSize}MB` });
        return;
      }

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Upload to Cloudinary via your backend
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", folder);

      try {
        const result = await uploadImage(formData).unwrap();
        onUpload?.(result?.data?.secure_url as string);
        smartToast(result);
      } catch (error) {
        setPreview(initialImage); // Revert preview on error
        smartToast({ error });
      } finally {
        // Clean up preview URL
        URL.revokeObjectURL(previewUrl);
      }
    },
    [uploadImage, folder, onUpload, maxSize, initialImage],
  );

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFileChange(file);
    // Reset input value to allow uploading same file again
    e.target.value = "";
  };

  const handleRemoveImage = useCallback(() => {
    setPreview(undefined);
    onUpload?.("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [onUpload]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleFileChange(file);
    }
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && <Label className="text-sm font-medium _label">{label}</Label>}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleInputChange}
        accept="image/*"
      />

      {!preview ? (
        // Upload Area
        <div
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200",
            "hover:border-primary hover:bg-primary/5",
            isDragging && "border-primary bg-primary/10 scale-[0.99]",
            !isDragging && "border-gray-300 bg-gray-50/30",
          )}
        >
          <div className="p-3 bg-white rounded-full shadow-sm">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium ">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, GIF up to {maxSize}MB
            </p>
          </div>
        </div>
      ) : (
        // Preview Area - Added 'group' class back
        <div className={cn("relative group", aspectRatioClasses[aspectRatio])}>
          <div className="relative w-full h-full overflow-hidden rounded-xl bg-gray-100">
            <img
              src={preview}
              alt="Upload preview"
              className="w-full h-full object-cover"
            />

            {/* Mobile: Floating action buttons at bottom */}
            <div className="absolute bottom-3 right-3 flex gap-2 lg:hidden">
              <Button
                size="icon-sm"
                variant="secondary"
                onClick={triggerFileInput}
                className="text-foreground backdrop-blur-sm shadow-lg "
                disabled={isLoading}
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
              <Button
                size="icon-sm"
                variant="outline"
                onClick={handleRemoveImage}
                className="shadow-lg"
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Desktop: Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden lg:flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={triggerFileInput}
                disabled={isLoading}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Change
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRemoveImage}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      <OverlayLoader
        message="Uploading image..."
        isLoading={isLoading}
        blur={false}
      />
    </div>
  );
}
