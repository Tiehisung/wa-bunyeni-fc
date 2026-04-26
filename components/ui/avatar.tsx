"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";
import { getInitials } from "@/lib";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };

// Define size options
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number;

interface AVATARProps {
  src?: string;

  alt?: string;
  className?: string;
  size?: AvatarSize;
  shape?: "circle" | "square" | "rounded";
  border?: boolean;
  borderColor?: string;
  onClick?: () => void;
}

// Size mapping for predefined sizes
const sizeMap = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-xl",
  "2xl": "h-32 w-32 text-2xl",
};

// Shape mapping
const shapeMap = {
  circle: "rounded-full",
  square: "rounded-none",
  rounded: "rounded-lg",
};

export function AVATAR({
  src,

  alt,
  className,
  size = "md",
  shape = "circle",
  border = false,
  borderColor = "border-primary",
  onClick,
}: AVATARProps) {
  // Handle custom numeric size
  const getCustomSize = (customSize: number) => {
    return {
      width: customSize,
      height: customSize,
      fontSize: Math.max(customSize / 3, 12), // Responsive font size
    };
  };

  // Get size classes or custom style
  const sizeClasses = typeof size === "string" ? sizeMap[size] : "";
  const customStyle =
    typeof size === "number"
      ? getCustomSize(size)
      : ({} as {
          width: number;
          height: number;
          fontSize: number;
        });

  return (
    <Avatar
      className={cn(
        // Base classes
        sizeClasses,
        shapeMap[shape],
        border && `border-2 ${borderColor}`,
        onClick && "cursor-pointer hover:opacity-80 transition-opacity",
        className,
      )}
      style={typeof size === "number" ? customStyle : undefined}
      onClick={onClick}
    >
      <AvatarImage src={src} alt={alt || "avatar"} className="object-cover" />
      <AvatarFallback
        className={cn(
          "bg-muted text-muted-foreground font-medium",
          typeof size === "number" && { fontSize: customStyle?.fontSize },
        )}
      >
        {getInitials((alt as string) || "image")}
      </AvatarFallback>
    </Avatar>
  );
}
