import type { ReactNode } from "react";
import { Button, TButtonSize, TButtonVariant } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "./ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface IDrawer {
  children: ReactNode;
  trigger?: ReactNode;
  triggerStyles?: string;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  id?: string;
  variant?: TButtonVariant;
  size?: TButtonSize;
  header?: ReactNode;
  roundedTop?: boolean;
}

export function SideDrawer({
  side = "right",
  trigger = <Menu />,
  triggerStyles = "",
  children,
  className = "",
  id,
  size,
  variant,
  header,
  roundedTop,
}: IDrawer) {
  return (
    <Sheet>
      <SheetTrigger asChild id={id} className={` ${!trigger ? "sr-only" : ""}`}>
        <Button
          variant={variant}
          size={size}
          className={` ${triggerStyles} cursor-pointer`}
        >
          {trigger}
        </Button>
      </SheetTrigger>
      <SheetContent
        side={side}
        className={roundedTop ? "rounded-t-2xl md:rounded-t-3xl" : ""}
      >
        <SheetHeader>
          <SheetTitle>{header}</SheetTitle>
        </SheetHeader>
        <div className={cn(` overflow-y-auto max-h-[85vh] `, className)}>
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
