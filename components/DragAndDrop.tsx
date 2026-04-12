"use client";
import { useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { fireDoubleEscape } from "@/hooks/Esc";
import { validateFile } from "@/lib/file";
import { ICloudinaryFile } from "@/types/file.interface";
import { getErrorMessage } from "@/lib/error";
import {
  useUploadDocumentMutation,
  useUploadImageMutation,
  useUploadVideoMutation,
} from "@/services/upload.endpoints";
import { smartToast } from "@/utils/toast";

export const DragAndDropUpload = ({
  onChange,
  className,
  fileType = "all",
  children,
  folder = "files",
  escapeOnEnd,
  exportRaw,
  maxFileSize = 100000000,
}: {
  onChange: (file: ICloudinaryFile) => void;
  className?: string;
  error?: string;
  fileType: "image" | "pdf" | "video" | "all";
  children: ReactNode;
  folder?: string;
  escapeOnEnd?: boolean;
  maxFileSize?: number;
  exportRaw?: (file: File) => void;
}) => {
  const [file, setFile] = useState<File | null | undefined>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const [uploadImage] = useUploadImageMutation();
  const [uploadVideo] = useUploadVideoMutation();
  const [uploadPDF] = useUploadDocumentMutation();

  const handleUpload = async () => {
    try {
      const { status, message } = validateFile(
        file as File,
        fileType,
        maxFileSize,
      );

      if (!status) {
        toast.error(message);
        return;
      }
      let result: any;
      const formData = new FormData();

      formData.append("folder", folder);

      if (file?.type.includes("image")) {
        formData.append("image", file);
        result = await uploadImage(formData);
      }

      if (file?.type.includes("video")) {
        formData.append("video", file);
        result = await uploadVideo(formData);
      }

      if (file?.type.includes("pdf")) {
        formData.append("document", file);
        result = await uploadPDF(formData);
      }

      if (result.success) onChange(result?.data as ICloudinaryFile);

      if (escapeOnEnd) fireDoubleEscape(500);
      smartToast(result);
      setFile(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      const { status, message } = validateFile(file, fileType, maxFileSize);
      if (status) {
        setFile(file);
      } else {
        toast.error(message);
        return;
      }
    }
    setIsDragOver(false);
  };

  // Controller
  useEffect(() => {
    if (exportRaw) {
      exportRaw(file as File);
    } else {
      if (file) handleUpload();
    }
  }, [file, exportRaw]);

  return (
    <div
      className={`border-2 ${isUploading ? "pointer-events-none" : ""} ${
        isDragOver ? "border-dotted border-Green" : "border-transparent"
      } ${className || ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragOver(false);
      }}
      onDrop={handleDrop}
    >
      {children}
      {/* <OverlayLoader isLoading={isUploading} /> */}
    </div>
  );
};
