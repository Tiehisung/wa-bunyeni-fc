"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { ReactNode } from "react";
import { Button, TButtonSize, TButtonVariant } from "./ui/button";
import { cn } from "@/lib/utils";

export function PrimaryDropdown({
  children,
  className,
  trigger = <MoreHorizontal size={20} />,
  triggerStyles = " ",
  id,
  hideAngle = true,
  align = "end",
  size = "icon-sm",
  variant = "ghost",
}: {
  children: ReactNode;
  trigger?: ReactNode;
  className?: string;
  id?: string;
  triggerStyles?: string;
  hideAngle?: boolean;
  align?: "center" | "start" | "end";
  variant?: TButtonVariant;
  size?: TButtonSize;
}) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild id={id}>
        <Button
          variant={variant}
          size={size}
          className={cn(
            ` gap-1 flex items-center cursor-pointer text-muted-foreground p-2 rounded-full `,
            triggerStyles,
          )}
        >
          {trigger}
          {!hideAngle && <ChevronDown size={16} />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`w-56 ${className}`} align={align}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Hover dropdown

export function HoverDropdown({
  children,
  openDelay = 20,
  trigger = <MoreHorizontal size={20} />,
  triggerStyles = "hover:bg-background/50 p-2",
  className,
  id,
  hideAngle = true,
}: {
  children: ReactNode;
  trigger?: ReactNode;
  openDelay?: 0 | 20 | 50 | 100 | 200 | 500;
  className?: string;
  id: string;
  triggerStyles?: string;
  hideAngle?: boolean;
}) {
  return (
    <HoverCard openDelay={openDelay}>
      <HoverCardTrigger
        className={`gap-1 flex items-center cursor-pointer ${triggerStyles}`}
        id={id}
      >
        {trigger} {!hideAngle && <ChevronDown size={16} />}
      </HoverCardTrigger>
      <HoverCardContent className={className}>{children}</HoverCardContent>
    </HoverCard>
  );
}
