"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ENV } from "@/lib/env";
import { Button } from "../buttons/Button";

interface UploadResult {
  secure_url: string;
  public_id: string;
  thumbnail_url?: string;
  format?: string;
  bytes?: number;
}

interface AvatarUploadWidgetProps {
  onUpload: (result: UploadResult) => void;
  folder?: string;
  cropping?: boolean;
  initialImage?: string;
  className?: string;
  uploadButtonText?: string;
  previewFileStyles?: string;
  trigger?: ReactNode;
}

const SingleImageUploadWidget = ({
  onUpload,
  folder = "avatars",
  cropping = true,
  initialImage,
  className = "",
  uploadButtonText = "Upload Photo",
  trigger,
}: AvatarUploadWidgetProps) => {
  const [loaded, setLoaded] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    initialImage,
  );
  const [isUploading, setIsUploading] = useState(false);
  const widgetRef = useRef<any>(null);

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
    croppingAspectRatio: cropping ? 1 : undefined,
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
          return;
        }

        if (result?.event === "success") {
          const file = result.info as UploadResult;
          onUpload(file);
        }
      },
    );
  };

  return (
    <Button
      variant={"outline"}
      onClick={handleUpload}
      disabled={isUploading || !loaded}
      className={cn(
        "text-sm font-medium transition-colors",
        (isUploading || !loaded) && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {trigger || (
        <span>
          {isUploading
            ? "Uploading..."
            : !loaded
              ? "Loading..."
              : previewImage
                ? "Change Photo"
                : uploadButtonText}
        </span>
      )}
    </Button>
  );
};
export default SingleImageUploadWidget;
