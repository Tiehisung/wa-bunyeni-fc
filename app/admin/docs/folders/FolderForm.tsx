'use client'

import { Button } from "@/components/buttons/Button";
import { IconInputWithLabel } from "@/components/input/Inputs";
import { IFolder } from "@/types/doc";
import { EUserRole } from "@/types/user";
import { useState } from "react";
import { useAppSelector } from "@/store/hooks/store";
import {
  useCreateFolderMutation,
  useUpdateFolderMutation,
} from "@/services/docs.endpoints";
import { smartToast } from "@/utils/toast";
import { fireEscape } from "@/hooks/Esc";
import { getErrorMessage } from "@/lib/error";
import { CHECKBOX } from "@/components/input/Checkbox";
import { IQueryResponse } from "@/types";

export function FolderForm({ folder }: { folder?: IFolder }) {
  const [nameError, setNameError] = useState("");
  const [createFolder, { isLoading: creatingFolder, error }] =
    useCreateFolderMutation();
  const [updateFolder, { isLoading: updatingFolder, error: updatingError }] =
    useUpdateFolderMutation();

  const [formdata, setFormdata] = useState({
    name: folder?.name || "",
    description: folder?.description || "",
    isDefault: folder?.isDefault ,
  });

  const handleCreate = async () => {
    try {
      let result: IQueryResponse;

      if (folder) {
        result = await updateFolder({ ...formdata, _id: folder?._id }).unwrap();
      } else {
        result = await createFolder({ ...formdata }).unwrap();
      }
      smartToast(result);
      fireEscape();
    } catch (error) {
      smartToast({ error });
    }
  };

  // Using dummy user instead of session
  const { user } = useAppSelector((s) => s.auth);
  const isSuperAdmin = user?.role === EUserRole.SUPER_ADMIN;

  return (
    <div className="sm:max-w-lg space-y-8 pt-6">
      <IconInputWithLabel
        label="New Folder Name"
        error={nameError}
        onChange={(e) => {
          setFormdata({ ...formdata, name: e.target.value });
          if (e.target.value.trim()) setNameError("");
        }}
        name="name"
        value={formdata.name}
      />
      <IconInputWithLabel
        label="Description"
        onChange={(e) =>
          setFormdata({ ...formdata, description: e.target.value })
        }
        name="description"
        value={formdata.description}
      />

      <CHECKBOX
        onChange={(ev) =>
          setFormdata((p) => ({ ...p, isDefault: ev.target.checked }))
        }
        disabled={!isSuperAdmin}
        checked={formdata.isDefault}
        label="Set as system default"
      />

      <Button
        onClick={handleCreate}
        primaryText={folder ? "Update Folder" : "Create Folder"}
        waiting={creatingFolder || updatingFolder}
        waitingText={folder ? "Updating..." : "Creating..."}
        className="w-full"
      />

      {error && (
        <p className="text-red-500 mt-2">
          {getErrorMessage(error || updatingError)}
        </p>
      )}
    </div>
  );
}
