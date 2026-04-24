"use client";

import { FileUp } from "lucide-react";

 
import { CloudinaryWidget } from "@/components/cloudinary/Cloudinary";
import { useCreateDocumentsMutation } from "@/services/docs.endpoints";
import { smartToast } from "@/utils/toast";
import { ICloudinaryFile } from "@/types/file.interface";
import { IDocFile } from "@/types/doc";
import { TButtonVariant } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

interface IProps {
  defaultFolderId?: string;
  className?: string;
  variant?: TButtonVariant;
}

export function DocumentUploader({
  defaultFolderId = "",
  variant,
  className,
}: IProps) {
  const folderId = useParams().folderId || defaultFolderId || undefined;

  const [uploadeDoc, {}] = useCreateDocumentsMutation();

  const handleUpload = async (docs: ICloudinaryFile[]) => {
    try {
      if (docs.length == 0) return;

      const result = await uploadeDoc({
        folderId: folderId?.toString() as string,
        files: docs as IDocFile[],
      }).unwrap();
      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <CloudinaryWidget
      hidePreview
      trigger={
        <>
          <FileUp /> File Upload
        </>
      }
      className={cn("justify-start w-full", className)}
      onUploadSuccess={handleUpload}
      resourceType="raw"
      maxFiles={5}
      multiple
      variant={variant}
    />
  );
}
