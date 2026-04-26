"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/buttons/Button";
import { formatDate } from "@/lib/timeAndDate";
import { IDocFile } from "@/types/doc";
import { shortText } from "@/lib";
import { formatBytes } from "@/lib/file";
import { CopyButton } from "@/components/buttons/CopyBtn";
import FileRenderer from "@/components/files/FileRender";
import { getFileIconByExtension } from "@/data/file";
import { AVATAR } from "@/components/ui/avatar";

interface FileInfoPaneProps {
  file: IDocFile | null;
  onDownload?: (doc: IDocFile) => void;
  onDelete?: (doc: IDocFile) => void;
}

export function FileInfoPane({
  file,
  onDownload,
  onDelete,
}: FileInfoPaneProps) {
  if (!file) return null;

  const handleDownload = () => {
    if (onDownload) {
      onDownload(file);
    } else {
      const link = document.createElement("a");
      link.href = file.secure_url;
      link.download = file.original_filename || "document";
      link.click();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(file);
    }
  };

  return (
    <div>
      <h1 className="flex items-center gap-2">
        {getFileIconByExtension(file.secure_url)} File Information
      </h1>

      <Separator className="my-1.5 bg-border/40" />

      {/* Preview Image */}

      <div className="flex justify-center py-4 bg-accent">
        <FileRenderer file={file} className="max-h-44 object-contain" />
      </div>

      {/* File Info Table */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Name:</span>
          <span className="text-sm font-medium text-right">
            {file.original_filename || "—"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Type:</span>
          <Badge variant="outline" className="text-xs">
            {file.format?.toUpperCase() || "Document"}
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Size:</span>
          <span className="text-sm font-mono">
            {file.bytes ? formatBytes(file.bytes) : "—"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Folder:</span>
          <span className="text-sm capitalize">
            {file?.folder?.name || "General"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Uploaded:</span>
          <span className="text-sm">
            {file.createdAt ? formatDate(file.createdAt) : "—"}
          </span>
        </div>

        {/* Tags */}
        {/* {file.tags && file.tags.length > 0 && (
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Tags:</span>
              <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                {file.tags.slice(0, 3).map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {file.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{file.tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )} */}

        {/* Description */}
        {file.description && (
          <div className="flex justify-between items-start">
            <span className="text-sm text-muted-foreground">Description:</span>
            <span className="text-sm text-right max-w-[60%]">
              {shortText(file.description, 60)}
            </span>
          </div>
        )}

        {/* Public ID */}
        <div className="flex justify-between items-start">
          <span className="text-sm text-muted-foreground">Public ID:</span>
          <span className="text-xs font-mono text-right max-w-[60%] break-all">
            {shortText(file.public_id, 30)}
          </span>
        </div>

        {file.createdBy && (
          <div className="flex justify-between items-start">
            <span className="text-sm text-muted-foreground">Created By:</span>
            <span className="text-sm text-right max-w-[60%]">
              {shortText(file.createdBy.name)}
              <AVATAR
                src={file?.createdBy?.avatar as string}
                alt={file?.createdBy.name}
                size={"sm"}
              />
            </span>
          </div>
        )}
      </div>

      <Separator className="my-1.5 bg-border/40" />

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <CopyButton
          textToCopy={file.secure_url}
          variant={"outline"}
          size={"sm"}
        />
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-1" />
          Download
        </Button>
        {onDelete && (
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
