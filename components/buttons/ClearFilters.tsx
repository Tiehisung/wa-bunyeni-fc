 "use client";



import { useUpdateSearchParams } from "@/hooks/params";
import { MdOutlineFilterAltOff } from "react-icons/md";
import { Button, TButtonSize, TButtonVariant } from "../ui/button";
import { X } from "lucide-react";

export const ClearFiltersBtn = ({
  className = " rounded px-2 ",
  label,
  size,
  variant='ghost',
}: {
  className?: string;
  label?: string;
  variant?: TButtonVariant;
  size?: TButtonSize;
}) => {
  const { clearParams } = useUpdateSearchParams();

  return (
    <Button
      variant={variant}
      size={size}
      title="Clear filters"
      className={`_hover _active _shrink text-xs transform active:text-primaryRed p-2 w-fit select-none cursor-pointer ${className}`}
      onClick={() => clearParams()}
    >
      {label ? <span>{label}</span> : <MdOutlineFilterAltOff size={20} />}
    </Button>
  );
};

export const ClearBtn = ({
  className = "",
  label = "Clear Filter",
  size = "sm",
  variant = "ghost",
  onClick,
}: {
  className?: string;
  label?: string;
  variant?: TButtonVariant;
  size?: TButtonSize;
  onClick?: () => void;
}) => {
  const { clearParams } = useUpdateSearchParams();

  return (
    <Button
      variant={variant}
      size={size}
      title="Clear filters"
      onClick={() => {
        if (typeof onClick !== "undefined") onClick();
        else clearParams();
      }}
      className={className}
    >
      <X className="h-4 w-4 " /> {label}
    </Button>
  );
};
