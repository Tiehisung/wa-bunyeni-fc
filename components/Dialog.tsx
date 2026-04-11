import type { FC, ReactNode } from "react";
import { Button, TButtonSize, TButtonVariant } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { fireDoubleEscape } from "@/hooks/Esc";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./loaders/LoadingSpinner";

interface IDialog {
  hideCloseBtn?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  trigger: ReactNode;
  triggerStyles?: string;
  id?: string;
  variant?: TButtonVariant;
  size?: TButtonSize;
  modal?: boolean; //Turn to 'false' when using another modal within e.g cloudinary upload widget
  onOpen?: (b: boolean) => void;
  escapeOnClose?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

export const DIALOG: FC<IDialog> = ({
  title,
  description,
  children,
  className,
  trigger = <MoreHorizontal className="h-4 w-4" />,
  triggerStyles = "",
  id,
  variant = "secondary",
  size,
  onOpen,
  modal = true,
  escapeOnClose = true,
  disabled,
  isLoading,
}) => {
  if (!trigger) return null;
  return (
    <Dialog
      modal={modal}
      onOpenChange={(s) => {
        onOpen?.(s);
        if (escapeOnClose && !s) fireDoubleEscape(); //May be useful in closing parent modal/popovers
      }}
    >
      <DialogTrigger asChild className={!trigger ? "sr-only" : ""} id={id}>
        <Button
          variant={variant}
          size={size}
          title={typeof title == "string" ? title : ""}
          className={`h-fit ${triggerStyles}`}
          disabled={disabled}
        >
          {trigger}
        </Button>
      </DialogTrigger>

      <DialogContent className={cn(`p-2 `, className)}>
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription hidden={!description}>
            {description}
          </DialogDescription>
        </DialogHeader>

        <main className={` max-h-[80vh] overflow-y-auto max-w-full pb-6`}>
          {isLoading ? <LoadingSpinner /> : children}
        </main>

        <DialogFooter>
          <DialogClose asChild>
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
