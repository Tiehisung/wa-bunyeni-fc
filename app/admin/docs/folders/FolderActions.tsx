"use client";

import { PrimaryDropdown } from "@/components/Dropdown";
import { Edit, Trash } from "lucide-react";
import { DIALOG } from "@/components/Dialog";
import { FolderForm } from "./FolderForm";
import { IFolder } from "@/types/doc";
import { useDeleteFolderMutation } from "@/services/docs.endpoints";
import { fireEscape } from "@/hooks/Esc";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface IProps {
  folder?: IFolder;
}

export function FolderActions({ folder }: IProps) {
  const [deleteFolder, { isLoading }] = useDeleteFolderMutation();

  const handleDelete = async () => {
    if (!folder?._id) return;
    await deleteFolder(folder._id);
    fireEscape();
  };
  return (
    <PrimaryDropdown
      id={folder?._id}
      className="grid gap-1.5 p-4"
      triggerStyles="rotate-90 opacity-90 _shrink"
    >
      <DIALOG
        trigger={
          <>
            <Edit className="text-muted-foreground" /> Edit
          </>
        }
        triggerStyles="justify-start font-normal"
        title={<p>Edit folder - {folder?.name}</p>}
        escapeOnClose
        variant={"ghost"}
      >
        <FolderForm folder={folder} />
      </DIALOG>

      <ConfirmDialog
        description={`Are you sure you want to delete ${folder?.name}? ${
          (folder?.docsCount ?? folder?.documents?.length ?? 0) > 0
            ? `${folder?.docsCount} file${
                folder?.docsCount !== 1 ? "s" : ""
              } in this folder will be deleted as well!`
            : ""
        } `}
        onConfirm={handleDelete}
        trigger={
          <>
            <Trash size={24} className="text-muted-foreground" /> Delete
          </>
        }
        triggerStyles={"justify-start font-normal"}
        title="Delete Folder"
        variant={"ghost"}
        isLoading={isLoading}
      />
    </PrimaryDropdown>
  );
}
