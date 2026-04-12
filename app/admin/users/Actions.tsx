"use client";

import { ConfirmActionButton } from "@/components/buttons/ConfirmAction";
import { PrimaryDropdown } from "@/components/Dropdown";
import { IUser } from "@/types/user";
import { Edit } from "lucide-react";
import { MdOutlineDelete } from "react-icons/md";
import UserForm from "./UserForm";
import { DIALOG } from "@/components/Dialog";
import { useDeleteUserMutation } from "@/services/user.endpoints";
import { smartToast } from "@/utils/toast";

interface IProps {
  user?: IUser;
}

export function UserActions({ user }: IProps) {
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleDelete = async () => {
    if (!user?._id) return;

    try {
      const result = await deleteUser(user._id).unwrap();
      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <PrimaryDropdown id={user?._id}>
      <ul>
        <li className="p-2 text-sm font-light border-b ">{user?.name}</li>
        <li>
          <DIALOG
            trigger={
              <>
                <Edit className="text-muted-foreground" /> Edit
              </>
            }
            title={<p>Edit User - {user?.name}</p>}
            triggerStyles="w-full justify-start"
            variant={"ghost"}
          >
            <UserForm user={user} />
          </DIALOG>
        </li>

        <li>
          <ConfirmActionButton
            primaryText="Delete"
            trigger={
              <>
                <MdOutlineDelete size={24} /> Delete
              </>
            }
            triggerStyles="w-full justify-start"
            onConfirm={handleDelete}
            variant="destructive"
            title="Delete User"
            confirmText={`Are you sure you want to delete ${user?.name}?`}
            isLoading={isDeleting}
            escapeOnEnd
          />
        </li>
      </ul>
    </PrimaryDropdown>
  );
}
