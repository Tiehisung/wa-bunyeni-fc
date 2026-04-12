import { useRef } from "react";
import { useUploadDocumentMutation } from "@/services/upload.endpoints";
import { Button } from "@/components/buttons/Button";
import { Loader2, FileText } from "lucide-react";
import { ICloudinaryFile } from "@/types/file.interface";

interface SimpleDocumentUploaderProps {
  /** Called when upload is successful */
  onUploadSuccess?: (documentData?: ICloudinaryFile) => void;
  /** Called when upload fails */
  onUploadError?: (error: string) => void;
  /** Maximum file size in bytes (default: 10MB) */
  maxSize?: number;
  /** Allowed document types */
  allowedTypes?: string[];
  /** Upload folder in Cloudinary */
  folder?: string;
  /** Button text */
  buttonText?: string;
  /** Button variant */
  buttonVariant?: "default" | "outline" | "ghost";
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
}

export function SimpleDocumentUploader({
  onUploadSuccess,
  onUploadError,
  maxSize = 10 * 1024 * 1024, // 10MB default for documents
  allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "application/rtf",
  ],
  folder = "documents",
  buttonText = "Upload Document",
  buttonVariant = "default",
  className = "",
  disabled = false,
  showIcon = true,
  multiple = false,
  acceptedFileText = "PDF, DOC, DOCX, XLS, XLSX, TXT, RTF",
}: SimpleDocumentUploaderProps) {
  const [uploadDocument, { isLoading }] = useUploadDocumentMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get file extension from name
  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "unknown";
  };

  // Validate document file
  const validateDocument = (file: File): string | null => {
    if (
      !file.type.startsWith("application/") &&
      !file.type.startsWith("text/") &&
      file.type !== "application/rtf"
    ) {
      return "File must be a document";
    }

    if (!allowedTypes.includes(file.type)) {
      const extensions = allowedTypes
        .map((t) => {
          if (t.includes("pdf")) return "PDF";
          if (t.includes("msword")) return "DOC";
          if (t.includes("openxmlformats")) return "DOCX";
          if (t.includes("excel")) return "XLS/XLSX";
          if (t.includes("text")) return "TXT";
          if (t.includes("rtf")) return "RTF";
          return t.split("/").pop();
        })
        .filter(Boolean)
        .join(", ");

      return `Invalid document type. Allowed: ${extensions}`;
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
    const validationError = validateDocument(file);
    if (validationError) {
      onUploadError?.(validationError);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("folder", folder);

      // Add original filename as metadata
      formData.append("originalName", file.name);
      formData.append("fileExtension", getFileExtension(file.name));

      const result = await uploadDocument(formData).unwrap();
      onUploadSuccess?.(result?.data as ICloudinaryFile);
    } catch (err: any) {
      onUploadError?.(err?.data?.message || "Upload failed");
    }
  };

  // Get accept string for input
  const getAcceptString = () => {
    return allowedTypes.join(",");
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptString()}
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
        title={`Accepted files: ${acceptedFileText} (Max: ${(maxSize / 1024 / 1024).toFixed(0)}MB)`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            {showIcon && <FileText className="h-4 w-4 mr-2" />}
            {buttonText}
          </>
        )}
      </Button>
    </>
  );
}
