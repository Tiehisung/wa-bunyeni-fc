"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ENV } from "@/lib/env";

interface UploadResult {
  secure_url: string;
  public_id: string;
  thumbnail_url?: string;
  format?: string;
  bytes?: number;
}

interface AvatarUploadWidgetProps {
  onUpload: (result: UploadResult) => void;
  onRemove?: () => void;
  folder?: string;
  cropping?: boolean;
  initialImage?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "square" | "rounded";
  showUploadButton?: boolean;
  uploadButtonText?: string;
  previewFileStyles?: string;
  triggerId?: string;
}

export const ImageUploadWidget = ({
  onUpload,
  onRemove,
  folder = "avatars",
  cropping = true,
  initialImage,
  className = "",
  size = "md",
  shape = "circle",
  showUploadButton = true,
  uploadButtonText = "Upload Photo",
  previewFileStyles,
  triggerId,
}: AvatarUploadWidgetProps) => {
  const [loaded, setLoaded] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    initialImage,
  );
  const [isUploading, setIsUploading] = useState(false);
  const widgetRef = useRef<any>(null);

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

  // Load Cloudinary widget script
  useEffect(() => {
    if (!loaded && typeof window !== "undefined") {
      const script = document.createElement("script");
      script.setAttribute("async", "");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.addEventListener("load", () => setLoaded(true));
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [loaded]);

  // Configure upload widget
  const uwConfig = {
    cloudName: ENV.CLOUDINARY.CLOUD_NAME,
    uploadPreset: ENV.CLOUDINARY.UPLOAD_PRESET,
    folder,
    cropping,
    croppingAspectRatio: cropping && shape === "circle" ? 1 : undefined,
    multiple: false,
    maxFiles: 1,
    sources: ["local", "url", "camera", "google_drive"],
    clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
    showPoweredBy: false,
    theme: "minimal",
  };

  const handleUpload = () => {
    if (!loaded) {
      toast.error("Upload widget still loading...");
      return;
    }

    setIsUploading(true);
    widgetRef.current = (window as any).cloudinary?.openUploadWidget(
      uwConfig,
      (error: any, result: any) => {
        setIsUploading(false);

        if (error) {
          toast.error("Upload failed");
          console.error(error);
          return;
        }

        if (result?.event === "success") {
          const file = result.info as UploadResult;
          setPreviewImage(file.secure_url);
          onUpload(file);
          toast.success("Upload successful!");
        }
      },
    );
  };

  const handleRemove = () => {
    setPreviewImage(undefined);
    onRemove?.();
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
            previewFileStyles,
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
          <button
            id={triggerId}
            type="button"
            onClick={handleUpload}
            disabled={isUploading || !loaded}
            className={cn(
              "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
              (isUploading || !loaded) && "cursor-not-allowed",
            )}
            title={loaded ? "Upload new photo" : "Loading..."}
          >
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera className="text-white" size={size === "sm" ? 16 : 20} />
            )}
          </button>
        </div>

        {/* Remove button - only shown when image exists */}
        {previewImage && (
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition hover:bg-red-600 shadow-lg z-10"
            title="Remove image"
            type="button"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Upload Button */}
      {showUploadButton && (
        <button
          id={triggerId}
          type="button"
          onClick={handleUpload}
          disabled={isUploading || !loaded}
          className={cn(
            "text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors",
            (isUploading || !loaded) && "opacity-50 cursor-not-allowed",
          )}
        >
          {isUploading
            ? "Uploading..."
            : !loaded
              ? "Loading..."
              : previewImage
                ? "Change Photo"
                : uploadButtonText}
        </button>
      )}
    </div>
  );
};
