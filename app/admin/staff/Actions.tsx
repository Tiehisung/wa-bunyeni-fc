"use client";

import { IStaff } from "@/types/staff.interface";
import StaffForm from "./StaffForm";
import { POPOVER } from "@/components/ui/popover";
import { Edit3, TrashIcon } from "lucide-react";
import { HiOutlineUserRemove } from "react-icons/hi";
import { Button } from "@/components/buttons/Button";
import { useUpdateSearchParams } from "@/hooks/params";
import { fireEscape } from "@/hooks/Esc";
import { StackModal } from "@/components/modals/StackModal";
import { RtkActionButton } from "@/components/buttons/ActionButtonRTK";
import {
  useDeleteStaffMutation,
  useUpdateStaffMutation,
} from "@/services/staff.endpoints";

const StaffActionsPopper = ({
  staff,
  onEdit,
}: {
  staff: IStaff;
  onEdit?: () => void;
}) => {
  const { setParam } = useUpdateSearchParams();

  return (
    <>
      <POPOVER>
        <div className="grid gap-1">
          <Button
            className="w-full _hover bg-transparent _shrink justify-start gap-3"
            onClick={() => {
              if (onEdit) {
                onEdit();
              } else {
                setParam("stackModal", staff._id);
                fireEscape();
              }
            }}
            variant={"ghost"}
          >
            <Edit3 /> Edit
          </Button>

          <RtkActionButton
            mutation={useUpdateStaffMutation}
            data={{ _id: staff._id, isActive: !staff.isActive }}
            primaryText={staff.isActive ? "Disengage Staff" : "Re-engage Staff"}
            onSuccess={(res) => {
              console.log("manager disengaged", res);
            }}
            variant="ghost"
            className="justify-start"
          >
            <HiOutlineUserRemove size={20} />
          </RtkActionButton>

          <RtkActionButton
            mutation={useDeleteStaffMutation}
            data={staff._id}
            primaryText="Delete Manager"
            loadingText="Deleting..."
            variant="ghost"
            className="justify-start"
            onSuccess={(res) => {
              console.log("manager deleted", res);
            }}
          >
            <TrashIcon />
          </RtkActionButton>
        </div>
      </POPOVER>

      <StackModal
        id={staff._id}
        className="bg-accent rounded-2xl _hideScrollbar"
        trigger={undefined}
      >
        <StaffForm
          existingStaff={staff}
          className="lg:flex flex-col min-w-[70vw] cursor-auto"
        />
      </StackModal>
    </>
  );
};

export default StaffActionsPopper;
