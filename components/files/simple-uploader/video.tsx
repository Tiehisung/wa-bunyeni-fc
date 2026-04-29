import { ReactNode, useRef } from "react";
import { useUploadVideoMutation } from "@/services/upload.endpoints";
import { Button } from "@/components/buttons/Button";
import { Loader2,   } from "lucide-react";
import { ICloudinaryFile } from "@/types/file.interface";
import { TButtonVariant } from "@/components/ui/button";

interface SimpleVideoUploaderProps {
  /** Called when upload is successful */
  onUploadSuccess?: (videoData?: ICloudinaryFile) => void;
  /** Called when upload fails */
  onUploadError?: (error: string) => void;
  /** Maximum file size in bytes (default: 100MB) */
  maxSize?: number;
  /** Allowed video types */
  allowedTypes?: string[];
  /** Upload folder in Cloudinary */
  folder?: string;
  /** Button text */
  trigger?: ReactNode;
  /** Button variant */
  buttonVariant?: TButtonVariant
  /** Custom class name */
  className?: string;
  /** Disable upload */
  disabled?: boolean;
  /** Accept multiple files */
  multiple?: boolean;
}

export function SimpleVideoUploader({
  onUploadSuccess,
  onUploadError,
  maxSize = 100 * 1024 * 1024, // 100MB default
  allowedTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
  folder = "videos",
  trigger = "Upload Video",
  buttonVariant = "default",
  className = "",
  disabled = false,
  multiple = false,
}: SimpleVideoUploaderProps) {
  const [uploadVideo, { isLoading }] = useUploadVideoMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate video file
  const validateVideo = (file: File): string | null => {
    if (!file.type.startsWith("video/")) {
      return "File must be a video";
    }

    if (!allowedTypes.includes(file.type)) {
      return `Invalid video type. Allowed: ${allowedTypes.map((t) => t.split("/")[1]).join(", ")}`;
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

    // Handle multiple files
    if (multiple) {
      for (let i = 0; i < files.length; i++) {
        await uploadSingleFile(files[i]);
      }
    } else {
      await uploadSingleFile(files[0]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Upload single file
  const uploadSingleFile = async (file: File) => {
    // Validate
    const validationError = validateVideo(file);
    if (validationError) {
      onUploadError?.(validationError);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("folder", folder);

      const result = await uploadVideo(formData).unwrap();
      onUploadSuccess?.(result?.data as ICloudinaryFile);
    } catch (err: any) {
      onUploadError?.(err?.data?.message || "Upload failed");
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

      <Button
        type="button"
        variant={buttonVariant}
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isLoading}
        className={className}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
           
            {trigger}
          </>
        )}
      </Button>
    </>
  );
}
