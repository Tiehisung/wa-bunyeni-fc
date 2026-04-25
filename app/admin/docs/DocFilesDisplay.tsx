"use client";

import {
  FileIcon,
  DownloadIcon,
  Edit,
  Info,
  UserPlus,
  Trash,
  Move,
} from "lucide-react";
import { Button } from "@/components/buttons/Button";
import { downloadFile, formatBytes, getThumbnail } from "@/lib/file";
import { IDocFile } from "@/types/doc";
import { POPOVER } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { FileInfoPane } from "./DocInfoModal";
import { DIALOG } from "@/components/Dialog";
import { getFileIconByExtension } from "@/data/file";
import { formatDate } from "@/lib/timeAndDate";
import { useAppSelector } from "@/store/hooks/store";
import { cn } from "@/lib/utils";
import { useState } from "react";
import SocialShare from "@/components/SocialShare";
import { CopyButton } from "@/components/buttons/CopyBtn";
import {
  useDeleteDocumentMutation,
  useUpdateDocumentMutation,
} from "@/services/docs.endpoints";
import { smartToast } from "@/utils/toast";
import { StackModal } from "@/components/modals/StackModal";
import { toggleClick } from "@/lib/dom";
import { DocMoveTo } from "./files/MoveTo";
import { Input } from "@/components/input/Inputs";
import { useUpdateSearchParams } from "@/hooks/params";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { AVATAR } from "@/components/ui/avatar";
import { shortText } from "@/lib";
import DocFilePreview from "./DocFilePreview";

interface UploadedFilesDisplayProps {
  files: IDocFile[];
  onRemove?: (fileId: string) => void;
  onDownload?: (file: IDocFile) => void;
  onPreview?: (file: IDocFile) => void;
  className?: string;
  showMetadata?: boolean;
  deletable?: boolean;
}

export function DocFilesDisplay({
  files,
  className = "",
}: UploadedFilesDisplayProps) {
  const { displayType } = useAppSelector((state) => state.settings);
  const [activeFileId, setActiveFileId] = useState("");
  if (files.length === 0) {
    return (
      <div
        className={`text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg ${className}`}
      >
        <FileIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No files uploaded yet</p>
      </div>
    );
  }

  return (
    <>
      <div className={`${className}`}>
        <section
          className={cn(
            "py-5 ",
            displayType == "list"
              ? "divide-y"
              : " grid gap-2 md:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {files?.map((fd) => (
            <DocumentFileCard
              key={fd._id}
              file={fd}
              isActive={activeFileId == fd._id}
              onClick={(f) => setActiveFileId(f?._id as string)}
            />
          ))}
        </section>
      </div>
    </>
  );
}

export function DocumentFileCard({
  file,
  isActive,
  onClick,
}: {
  file: IDocFile;
  onClick?: (file: IDocFile) => void;
  isActive?: boolean;
}) {
  const { format, secure_url, original_filename } = file;
  const { displayType } = useAppSelector((state) => state.settings);

  const docName = file?.original_filename;
  const [updateDoc, { isLoading: updatingDoc }] = useUpdateDocumentMutation();
  const [newName, setNewName] = useState(file?.original_filename);

  const [deleteDoc, { isLoading: deleting }] = useDeleteDocumentMutation();
  const handleDelete = async () => {
    try {
      if (!file?._id) return;

      const result = await deleteDoc(file._id).unwrap();
      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  const { clearParams } = useUpdateSearchParams();
  const handleRename = async () => {
    try {
      if (!file?._id) return;

      const result = await updateDoc({
        original_filename: newName,
        _id: file._id,
      }).unwrap();
      smartToast(result);
      if (result.success) clearParams("stackModal");
    } catch (error) {
      smartToast({ error });
    }
  };

  const Actions = () => (
    <POPOVER className="w-56">
      <Button
        variant={"ghost"}
        className="w-full justify-start font-normal"
        onClick={() => downloadFile(secure_url, original_filename as string)}
      >
        <DownloadIcon /> Download
      </Button>

      <Button
        onClick={() => toggleClick(`r-${file._id}`)}
        variant={"ghost"}
        className="w-full justify-start font-normal"
      >
        <Edit /> Rename
      </Button>

      <DIALOG
        trigger={
          <>
            <Info /> File information
          </>
        }
        triggerStyles="w-full justify-start font-normal"
        variant={"ghost"}
      >
        <FileInfoPane file={file} />
      </DIALOG>

      <DIALOG
        trigger={
          <>
            <UserPlus /> Share
          </>
        }
        triggerStyles="w-full justify-start font-normal"
        variant={"ghost"}
        className="min-w-52 md:max-w-80 px-8"
      >
        <SocialShare
          url={file.secure_url}
          // files={Object.values(logos)}
          label="Share with others"
          className="justify-start"
        />
        <Separator className="mt-5 mb-3" />
        <CopyButton textToCopy={file.secure_url} variant={"outline"} />
      </DIALOG>

      <DocMoveTo
        trigger={
          <>
            <Move className="text-muted-foreground" size={24} /> Move To
          </>
        }
        document={file}
      />
      <Separator className="my-1.5 bg-border/45" />

      <ConfirmDialog
        trigger={
          <>
            <Trash size={24} /> Delete
          </>
        }
        triggerStyles="justify-start w-full font-normal"
        onConfirm={handleDelete}
        variant="ghost"
        title={`Delete Document`}
        description={`Are you sure you want to delete <b>"${docName}"</b>?`}
        isLoading={deleting}
      />
    </POPOVER>
  );

  if (displayType == "list")
    return (
      <div
        className={cn(
          "flex items-center gap-2.5 _hover py-2",
          isActive ? "bg-secondary" : "",
        )}
        onClick={() => onClick?.(file)}
      >
        <span className="w-8 px-1">
          {getFileIconByExtension(format || secure_url)}
        </span>
        <span className="text-sm line-clamp-1 grow" title={original_filename}>
          {original_filename}
        </span>
        <div className="flex items-center ml-auto">
          <span className="text-xs sm:text-sm text-nowrap font-light w-20">
            {formatDate(file.createdAt)}
          </span>
          <span className="text-nowrap text-xs hidden sm:block sm:text-sm">
            {formatBytes(file.bytes as number)}
          </span>
        </div>
        {file.createdBy && (
          <div className="hidden md:flex items-center gap-1 text-xs">
            {" "}
            <AVATAR
              src={file.createdBy?.avatar as string}
              alt={file.createdBy?.name}
              size={"sm"}
            />
            <span>{shortText(file.createdBy?.name?.split(" ")?.[0], 8)}</span>
          </div>
        )}
        <div onClick={(e) => e.stopPropagation()}>
          <Actions />
        </div>
        <StackModal
          triggerStyles="w-full justify-start font-normal"
          variant={"ghost"}
          id={`r-${file._id}`}
          title={'Rename'}
          className="cursor-auto"
        >
          <form className=" flex flex-col gap-4 items-center md:max-w-[70%] mx-auto mt-28">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              name={""}
              label="New name"
              wrapperStyles=" gap-3 items-center w-full min-w-[60%]"
            />
            <Button
              onClick={handleRename}
              waiting={updatingDoc}
              primaryText="Save"
              type="submit"
              disabled={newName == file.original_filename}
              className="grow w-full"
            />
          </form>
        </StackModal>
      </div>
    );

  return (
    <div
      className={cn(
        "bg-card p-3 rounded-xl hover:bg-popover/80 hover:ring ring-ring",
        isActive ? "bg-secondary" : "",
      )}
      onClick={() => onClick?.(file)}
    >
      <header className="flex items-center gap-3 justify-between ">
        <span>{getFileIconByExtension(format || secure_url)}</span>
        <span className="text-sm grow line-clamp-1">{original_filename}</span>
        <div onClick={(e) => e.stopPropagation()}>
          <Actions />
        </div>
      </header>
      <main>
        <div className="h-56 w-full md:h-60 lg:h-[40vh]">
          <DocFilePreview
            file={{ ...file, thumbnail_url: getThumbnail(file) }}
            fallbackUrl={file.thumbnail_url || file.secure_url}
            className="h-full w-full object-cover"
          />
        </div>
      </main>

      <StackModal
        triggerStyles="w-full justify-start font-normal"
        variant={"ghost"}
        id={`r-${file._id}`}
        title={"Rename"}
        
      >
        <form className=" flex flex-col gap-4 items-center md:max-w-[70%] mx-auto mt-28">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            name={""}
            label="New name"
            wrapperStyles=" gap-3 items-center w-full min-w-[60%]"
          />
          <Button
            onClick={handleRename}
            waiting={updatingDoc}
            primaryText="Save"
            type="submit"
            disabled={newName == file.original_filename}
            className="grow w-full"
          />
        </form>
      </StackModal>
    </div>
  );
}
