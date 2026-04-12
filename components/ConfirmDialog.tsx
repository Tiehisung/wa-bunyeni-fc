"use client";
import * as React from "react";

import { TButtonSize, TButtonVariant } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./buttons/Button";

interface ConfirmDialogProps {
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  disabled?: boolean;
  variant?: TButtonVariant;
  size?: TButtonSize;
  trigger?: React.ReactNode;
  triggerStyles?: string;
  className?: string;
  onConfirm?: () => Promise<void> | void;
  isLoading?: boolean;
}

export function ConfirmDialog({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  trigger,
  className,
  size,
  disabled,
  triggerStyles,
  onConfirm,
  isLoading: externalLoading,
}: ConfirmDialogProps) {
  const [internalLoading, setInternalLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const isLoading = externalLoading || internalLoading;

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default AlertDialogAction behavior
    if (!onConfirm) return;

    try {
      setInternalLoading(true);
      await onConfirm();
      setOpen(false); // Close dialog only on success
    } catch (error) {
      // Keep dialog open on error
      console.error("Confirm action failed:", error);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          title={typeof title === "string" ? title : ""}
          className={cn("h-fit", triggerStyles)}
          disabled={disabled}
          onClick={() => setOpen(true)}
        >
          {trigger}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className={cn("sm:max-w-md", className)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {typeof description === "string" ? (
              <div dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              description
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>

          {/* Option 1: Use AlertDialogAction with preventDefault */}
          <AlertDialogAction asChild>
            <Button
              variant={variant}
              onClick={handleConfirm}
              disabled={isLoading}
              waiting={isLoading}
              primaryText={confirmText}
            />
          </AlertDialogAction>

          {/* Option 2: Or just use a regular Button without AlertDialogAction */}
          {/* <Button
            variant={variant}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? loadingText : confirmText}
          </Button> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
