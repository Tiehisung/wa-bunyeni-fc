import { ReactNode, useRef, useState } from "react";
import { useUploadImageMutation } from "@/services/upload.endpoints";
import { Button } from "@/components/buttons/Button";
import { ICloudinaryFile } from "@/types/file.interface";
import { TButtonVariant } from "@/components/ui/button";

interface SimpleImageUploaderProps {
  /** Called when upload is successful */
  onUploadSuccess?: (imageData?: ICloudinaryFile) => void;
  /** Called when upload fails */
  onUploadError?: (error: string) => void;
  /** Maximum file size in bytes (default: 5MB) */
  maxSize?: number;
  /** Allowed image types */
  allowedTypes?: string[];
  /** Upload folder in Cloudinary */
  folder?: string;
  /** Button text */
  trigger?: ReactNode;
  /** Button variant */
  buttonVariant?: TButtonVariant;
  /** Custom class name */
  className?: string;
  /** Disable upload */
  disabled?: boolean;
  /** Show icon */
  showIcon?: boolean;
  /** Accept multiple files */
  multiple?: boolean;
  /** Accepted file extensions display text */
  acceptedFileText?: string;
  /** Enable cropping before upload */
}

export function SimpleImageUploader({
  onUploadSuccess,
  onUploadError,
  maxSize = 5 * 1024 * 1024, // 5MB default for images
  allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
  ],
  folder = "images",
  trigger = "Upload Image",
  buttonVariant = "default",
  className = "",
  disabled = false,
  multiple = false,
  acceptedFileText = "JPG, PNG, GIF, WEBP, SVG, BMP",
}: SimpleImageUploaderProps) {
  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  // Get file extension from name
  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "unknown";
  };

  // Validate image file
  const validateImage = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "File must be an image";
    }

    if (!allowedTypes.includes(file.type)) {
      const extensions = allowedTypes
        .map((t) => {
          if (t.includes("jpeg")) return "JPG";
          if (t.includes("png")) return "PNG";
          if (t.includes("gif")) return "GIF";
          if (t.includes("webp")) return "WEBP";
          if (t.includes("svg")) return "SVG";
          if (t.includes("bmp")) return "BMP";
          return t.split("/").pop();
        })
        .filter(Boolean)
        .join(", ");

      return `Invalid image type. Allowed: ${extensions}`;
    }

    if (file.size > maxSize) {
      return `File too large. Maximum size: ${(maxSize / 1024 / 1024).toFixed(0)}MB`;
    }

    return null;
  };

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate
    const validationError = validateImage(file);
    if (validationError) {
      onUploadError?.(validationError);
      return;
    }

    // Upload immediately
    await uploadSingleFile(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Upload single file
  const uploadSingleFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", folder);

      // Add metadata
      formData.append("originalName", file.name);
      formData.append("fileExtension", getFileExtension(file.name));

      const result = await uploadImage(formData).unwrap();
      onUploadSuccess?.(result?.data as ICloudinaryFile);
    } catch (err: any) {
      onUploadError?.(err?.data?.message || "Upload failed");
    } finally {
      // Clean up preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setShowCropper(false);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(",")}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isLoading}
        multiple={multiple}
      />

      {/* Simple Button Trigger */}
      <Button
        type="button"
        variant={buttonVariant}
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isLoading || showCropper}
        className={className}
        title={`Accepted files: ${acceptedFileText} (Max: ${(maxSize / 1024 / 1024).toFixed(0)}MB)`}
        waiting={isLoading}
      >
        {trigger}
      </Button>
    </>
  );
}
