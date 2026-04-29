"use client";

import { Button } from "@/components/buttons/Button";
import { DIALOG } from "@/components/Dialog";

import { ReactNode } from "react";
import { TButtonVariant } from "../ui/button";
import { fireEscape } from "@/hooks/Esc";

interface IProps {
  className?: string;
  variant?: TButtonVariant;
  confirmVariant?: TButtonVariant;
  primaryText?: string;
  loadingText?: string;
  children?: ReactNode;
  title?: string;
  confirmText?: string;

  escapeOnEnd?: boolean;
  gobackAfter?: boolean;

  trigger?: ReactNode;
  triggerStyles?: string;
  hidden?: boolean;
  disabled?: boolean;
  onConfirm?: () => Promise<void> | void;
  isLoading?: boolean;
}

export const ConfirmActionButton = ({
  variant,
  className,
  children,
  loadingText,
  primaryText = "",
  confirmText,
  title,
  hidden,
  trigger,
  triggerStyles = "",
  confirmVariant,
  disabled,
  onConfirm,
  isLoading,
  escapeOnEnd,
}: IProps) => {
  if (hidden) {
    return null;
  }

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();

      if (escapeOnEnd) fireEscape();
    } else {
      // Existing fetch logic with uri and body
    }
  };
  return (
    <DIALOG
      trigger={trigger ?? primaryText}
      title={title}
      variant={variant}
      triggerStyles={triggerStyles}
      disabled={disabled}
    >
      <div className="flex flex-col items-center justify-center py-6 ">
        {confirmText && (
          <div
            className="font-semibold text-sm text-muted-foreground mb-6"
            dangerouslySetInnerHTML={{ __html: confirmText }}
          />
        )}

        <Button
          waiting={isLoading}
          disabled={isLoading}
          primaryText={`Confirm ${primaryText ?? ""}`}
          waitingText={loadingText}
          onClick={handleConfirm}
          className={className}
          variant={confirmVariant ?? variant}
        >
          {children}
        </Button>
      </div>
    </DIALOG>
  );
};
