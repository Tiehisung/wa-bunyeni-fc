"use client";

import { fireEscape } from "@/hooks/Esc";
import { useDeleteFileMutation } from "@/services/upload.endpoints";
import { ICloudinaryFile } from "@/types/file.interface";
import { smartToast } from "@/utils/toast";
import { X } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../buttons/Button";
import { TButtonVariant } from "../ui/button";


interface ICloudinaryUploaderProps {
  uploadPreset?: string;
  multiple?: boolean;
  maxFiles?: number;
  folder?: string;
  resourceType?: "image" | "video" | "raw" | "document";
  deletable?: boolean;
  hidePreview?: boolean;

  trigger?: ReactNode;
  triggerId?: string;
  className?: string;

  dismissOnComplete?: boolean;
  cropping?: boolean;
  wrapperStyles?: string;
  mediaDisplayStyles?: string;
  clearCounter?: any;

  /** Maximum file size in mb */
  maxFileSize?: number;
  variant?: TButtonVariant;
  onUploadSuccess?: (files: ICloudinaryFile[]) => void;
  onClose?: (files: ICloudinaryFile[]) => void;
  onUploadFailure?: (error: any) => void;
}

export default function CloudinaryUploader({
  multiple = true,
  maxFiles = 4,
  folder = "players/gallery",
  resourceType = "raw",
  deletable = true,
  hidePreview = false,

  trigger = "Upload Media",
  triggerId = "cloudinary-uploader",
  variant = "outline",
  className,

  clearCounter,
  dismissOnComplete = true,
  cropping = false,
  wrapperStyles,
  mediaDisplayStyles,
  maxFileSize,
  onUploadSuccess,
  onClose,
}: ICloudinaryUploaderProps) {
  const [files, setFiles] = useState<ICloudinaryFile[]>([]);
  const [deleteFile] = useDeleteFileMutation();
  // console.log(ENV.CLOUDINARY.CLOUD_NAME, ENV.CLOUDINARY.UPLOAD_PRESET);

  useEffect(() => {
    setFiles([]);
  }, [clearCounter]);

  useEffect(() => {
    if (files) {
      onUploadSuccess?.(files);
    }
  }, [files]);

  const imageFormats = ["jpg", "png", "jpeg", "webp"];
  const videoFormats = [
    "mp4",
    "mov",
    "avi",
    "webm",
    "mkv",
    "flv",
    "wmv",
    "m4v",
    "mp3",
    "wav",
    "ogg",
    "m4a",
  ];
  const docFormats = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"];
  const allowedFormats =
    resourceType === "image"
      ? imageFormats
      : resourceType === "video"
        ? videoFormats
        : resourceType === "document"
          ? docFormats
          : [imageFormats, videoFormats, docFormats].flat();

  const handleRemove = async (file: ICloudinaryFile) => {
    try {
      setFiles((p) => p.filter((f) => f.public_id !== file.public_id));
      onUploadSuccess?.(files.filter((f) => f.public_id !== file.public_id));

      // Delete from Cloudinary
      const deleted = await deleteFile({
        public_id: file.public_id,
        resource_type: file.resource_type as ICloudinaryFile["resource_type"],
      }).unwrap();

      smartToast(deleted);
    } catch {
      // toast.error("Failed to delete file");
    }
  };

  const smartMaxSize =
    resourceType === "image"
      ? 10
      : resourceType === "video"
        ? 100
        : resourceType === "document"
          ? 10
          : 60;

  return (
    <div className={`flex flex-col items-center gap-4 ${wrapperStyles}`}>
      <CldUploadWidget
      
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string}
        options={{
          cloudName:process.env.NEXT_PUBLIC_CLOUDINARY_NAME|| 'dcjeydowa',
          sources: ["local", "camera", "url", "google_drive", "image_search"],
          multiple,
          maxFiles,
          folder,
          resourceType: resourceType ?? "auto",
          clientAllowedFormats: allowedFormats,
          maxFileSize: (maxFileSize || smartMaxSize) * 1024 * 1024, // 20MB
          theme: "minimal",
          showPoweredBy: false,
          cropping: cropping,
        }}
        
        onSuccess={(result) => {
          // Each successful upload fires this event
          if (result?.info) {
            const file = result.info as unknown as ICloudinaryFile;
            setFiles((prev) => {
              const updated = [...prev, file];
              onUploadSuccess?.(updated);
              return updated;
            });
          }
        }}
        onQueuesEnd={({ info }) => {
          // Fires when all uploads are done
          if (info) toast.success(`Finished`);
          if (dismissOnComplete) fireEscape();
        }}
        onClose={({ info }) => onClose?.(files)}
      >
        {({ open }) => (
          <Button
            id={triggerId}
            onClick={() => open()}
            className={`flex items-center gap-2 ${className}`}
            variant={variant}
          >
            {trigger ?? <span>Upload Media</span>}
          </Button>
        )}
      </CldUploadWidget>

      {/* Uploaded previews */}
      {!hidePreview && files?.length > 0 && (
        <div
          className={`flex items-center flex-wrap justify-center gap-3 mt-4 ${mediaDisplayStyles}`}
        >
          {files.map((f) => (
            <div
              key={f.public_id}
              className="relative rounded-lg overflow-hidden group max-h-80"
            >
              {f.resource_type === "video" ? (
                <video
                  src={f.secure_url}
                  controls
                  className="rounded-lg object-cover"
                />
              ) : (
                <Image
                  width={400}
                  height={400}
                  src={f.secure_url}
                  alt={f.original_filename ?? ""}
                  className="rounded-lg object-cover"
                />
              )}

              {deletable && (
                <button
                  type="button"
                  onClick={() => handleRemove(f)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
