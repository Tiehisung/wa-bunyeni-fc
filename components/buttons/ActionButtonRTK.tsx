"use client";

import { Button } from "@/components/buttons/Button";
import { fireEscape } from "@/hooks/Esc";
import React, { CSSProperties, ReactNode } from "react";
import { toast } from "sonner";
import { TButtonSize, TButtonVariant } from "../ui/button";
import { getErrorMessage } from "@/lib/error";

interface IProps<T> {
  className?: string;
  variant?: TButtonVariant;
  size?: TButtonSize;
  primaryText?: string;
  loadingText?: string;
  children?: ReactNode;
  escapeOnEnd?: boolean;
  disabled?: boolean;
  styles?: CSSProperties;
  disableToast?: boolean;
  id?: string;

  // RTK Query mutation hook
  mutation: any; // The RTK Query mutation hook (e.g., useDeleteSomethingMutation)
  data?: T; // Data to pass to the mutation
  onSuccess?: (result?: any) => void;
  onError?: (error?: any) => void;
}

export function RtkActionButton<T = any>({
  variant,
  className,
  children,
  loadingText,
  primaryText,
  escapeOnEnd = false,
  styles = {},
  disabled = false,
  disableToast,
  size,
  id,
  mutation,
  data,
  onSuccess,
  onError,
}: IProps<T>) {
  const [trigger, { isLoading }] = mutation();

  const handleAction = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const result = await trigger(data).unwrap();

      if (!disableToast) {
        toast.success(result?.message || "Action completed successfully");
      }

      onSuccess?.(result);

      if (escapeOnEnd) fireEscape();
    } catch (error) {
      toast.error(getErrorMessage(error));
      onError?.(error);
    }
  };

  return (
    <Button
      waiting={isLoading}
      disabled={disabled || isLoading}
      primaryText={primaryText}
      waitingText={loadingText}
      onClick={handleAction}
      className={className}
      styles={styles}
      variant={variant}
      size={size}
      id={id}
    >
      {children}
    </Button>
  );
}

// usage

// Example 1: Delete a player
// import { useDeletePlayerMutation } from "@/services/players.endpoints";

// function PlayerActions({ playerId }: { playerId: string }) {
//   return (
//     <RtkActionButton
//       mutation={useDeletePlayerMutation}
//       data={playerId}
//       primaryText="Delete Player"
//       loadingText="Deleting..."
//       variant="destructive"
//       successMessage="Player deleted successfully!"
//       onSuccess={() => {
//         // Additional logic after successful delete
//         console.log("Player deleted");
//       }}
//     >
//       <TrashIcon />
//     </RtkActionButton>
//   );
// }

// Example 2: Update a manager
// import { useUpdateManagerMutation } from "@/services/managers.endpoints";

// function DisengageManager({ manager }: { manager: IManager }) {
//   return (
//     <RtkActionButton
//       mutation={useUpdateManagerMutation}
//       data={{ id: manager._id, isActive: false }}
//       primaryText="Disengage Manager"
//       loadingText="Disengaging..."
//       variant="secondary"
//       escapeOnEnd
//     >
//       <HiOutlineUserRemove size={20} />
//     </RtkActionButton>
//   );
// }

// // Example 3: Create a match
// import { useCreateMatchMutation } from "@/services/matches.endpoints";

// function CreateMatchButton({ matchData }: { matchData: Partial<IMatch> }) {
//   return (
//     <RtkActionButton
//       mutation={useCreateMatchMutation}
//       data={matchData}
//       primaryText="Create Match"
//       loadingText="Creating..."
//       className="_primaryBtn"
//       onSuccess={() => {
//         // Refresh or navigate
//       }}
//     >
//       <PlusIcon />
//     </RtkActionButton>
//   );
// }
