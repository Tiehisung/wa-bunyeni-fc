"use client";

import { useEffect, useRef, useCallback, useState, ReactNode } from "react";
import { Button } from "@/components/buttons/Button";
import { Upload, X } from "lucide-react";
import { TButtonVariant } from "../ui/button";
import { ICloudinaryFile } from "@/types/file.interface";
import { smartToast } from "@/utils/toast";
import { useDeleteFileMutation } from "@/services/upload.endpoints";

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface CloudinaryWidgetProps {
  onUploadSuccess?: (files: ICloudinaryFile[]) => void;
  onClose?: (files: ICloudinaryFile[]) => void;
  onUploadFailure?: (error: any) => void;

  initialFiles?: ICloudinaryFile[];

  trigger?: ReactNode;
  variant?: TButtonVariant;
  className?: string;

  cloudName?: string;
  uploadPreset?: string;
  folder?: string;
  cropping?: boolean;
  multiple?: boolean;
  maxFiles?: number;

  resourceType?: "image" | "video" | "auto";
  maxFileSize?:
    | "2_000_000"
    | "5_000_000"
    | "10_000_000"
    | "20_000_000"
    | "40_000_000"
    | "60_000_000"
    | "80_000_000"
    | "100_000_000";

  deletable?: boolean;
  hidePreview?: boolean;
  mediaDisplayStyles?: string;
}

export function CloudinaryWidget({
  onUploadSuccess,
  onUploadFailure,
  onClose,

  trigger = "Upload Image",
  variant = "outline",
  className = "",

  folder = "bunyeni-fc",
  cropping = false,
  multiple = true,
  maxFiles = 1,
  resourceType = "image",
  maxFileSize = "10_000_000",

  deletable = true,
  hidePreview = false,
  mediaDisplayStyles,

  initialFiles = [],

  cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
}: CloudinaryWidgetProps) {
  const widgetRef = useRef<any>(null);
  const [uploadedFiles, setUploadedFiles] =
    useState<ICloudinaryFile[]>(initialFiles);

  // Use ref to always have the latest files without stale closures
  const uploadedFilesRef = useRef<ICloudinaryFile[]>(initialFiles);

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  const [deleteFile] = useDeleteFileMutation();

  // Keep ref in sync with state
  useEffect(() => {
    uploadedFilesRef.current = uploadedFiles;
  }, [uploadedFiles]);

  // Load Cloudinary script
  useEffect(() => {
    if (window.cloudinary) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;

    script.onload = () => setIsScriptLoaded(true);

    script.onerror = () => {
      setScriptError(true);
      onUploadFailure?.(new Error("Failed to load widget"));
    };

    document.body.appendChild(script);
  }, []);

  // Initialize widget
  useEffect(() => {
    if (!isScriptLoaded || !window.cloudinary) return;

    try {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          folder,
          sources: ["local", "camera", "dropbox", "google_drive"],
          multiple,
          maxFiles,
          cropping: multiple || maxFiles > 1 ? false : cropping,
          croppingAspectRatio: 1,
          clientAllowedFormats:
            resourceType === "image" ? ["image"] : undefined,
          maxImageFileSize: 5000000,
          maxVideoFileSize: Number(maxFileSize.replace(/_/g, "")),
        },
        (error: any, result: any) => {
          if (error) {
            onUploadFailure?.(error);
            return;
          }

          if (result?.event === "success") {
            const file = result.info as ICloudinaryFile;
            console.log("uploaded", file.original_filename);

            // Update both state and ref
            setUploadedFiles((prev) => {
              const newFiles = [...prev, file];
              uploadedFilesRef.current = newFiles;
              return newFiles;
            });
          }

          if (result?.event === "close") {
            // Use ref to get the latest files
            const currentFiles = uploadedFilesRef.current;
            console.log("close", `${currentFiles.length} uploaded`);

            // Widget closed - trigger callback with all uploaded files
            if (currentFiles.length > 0) {
              onUploadSuccess?.(currentFiles);
            }
            onClose?.(currentFiles);

            // Clear the state after callback
            setUploadedFiles([]);
            uploadedFilesRef.current = [];
          }
        },
      );
    } catch (error) {
      setScriptError(true);
      onUploadFailure?.(error);
    }
  }, [isScriptLoaded]);

  // Remove file from list (also delete from Cloudinary)
  const handleRemove = async (file: ICloudinaryFile) => {
    try {
      const updated = uploadedFiles.filter(
        (f) => f.public_id !== file.public_id,
      );
      setUploadedFiles(updated);
      uploadedFilesRef.current = updated;

      // Delete from Cloudinary
      const deleted = await deleteFile({
        public_id: file.public_id,
        resource_type: file.resource_type as ICloudinaryFile["resource_type"],
      }).unwrap();

      smartToast(deleted);
    } catch (error) {
      smartToast({ error });
    }
  };

  // Clear all files manually
  // const clearAllFiles = useCallback(() => {
  //   setUploadedFiles([]);
  //   uploadedFilesRef.current = [];
  // }, []);

  // Open widget
  const openWidget = useCallback(() => {
    widgetRef.current?.open();
  }, []);

  // Error UI
  if (scriptError) {
    return (
      <div className="text-red-500 border p-4 rounded">
        Upload widget failed to load
      </div>
    );
  }

  // Loading UI
  if (!isScriptLoaded) {
    return (
      <Button disabled>
        <Upload className="animate-pulse mr-2" />
        Loading uploader...
      </Button>
    );
  }

  return (
    <div className="space-y-5">
      {!hidePreview && uploadedFiles.length > 0 && (
        <div
          className={`flex flex-wrap justify-center gap-3 mt-4 ${mediaDisplayStyles}`}
        >
          {uploadedFiles.map((f) => (
            <div
              key={f.public_id}
              className="relative rounded-lg overflow-hidden group max-h-80"
            >
              {f.resource_type === "video" ? (
                <video
                  src={f.secure_url}
                  controls
                  className="rounded-lg object-cover max-h-40"
                />
              ) : (
                <img
                  src={f.secure_url}
                  alt=""
                  className="rounded-lg object-cover w-24 h-24"
                />
              )}

              {deletable && (
                <button
                  type="button"
                  onClick={() => handleRemove(f)}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-0.5 rounded-full transition"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        onClick={openWidget}
        className={`flex items-center gap-2 ${className}`}
        variant={variant}
      >
        {trigger}
      </Button>
    </div>
  );
}
