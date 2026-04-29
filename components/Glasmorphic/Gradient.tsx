// components/Glassmorphic/GlassmorphicGradient.tsx
import   { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassmorphicGradientProps {
  children: ReactNode;
  className?: string;
  gradient?: "primary" | "secondary" | "accent" | "custom";
  customGradient?: string;
  blur?: "sm" | "md" | "lg" | "xl";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  border?: boolean;
  shadow?: boolean;
  animated?: boolean;
}

const blurMap = {
  none: "backdrop-blur-none",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
};

const gradientMap = {
  primary: "bg-gradient-to-br from-primary/20 via-primary/10 to-transparent",
  secondary:
    "bg-gradient-to-tr from-secondary/20 via-secondary/10 to-transparent",
  accent: "bg-gradient-to-bl from-accent/20 via-accent/10 to-transparent",
  custom: "",
};

export function GlassmorphicGradient({
  children,
  className,
  gradient = "primary",
  customGradient,
  blur = "md",
  rounded = "xl",
  border = true,
  shadow = true,
  animated = false,
}: GlassmorphicGradientProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden backdrop-blur-md",
        gradient === "custom" ? customGradient : gradientMap[gradient],
        rounded === "none" ? "" : `rounded-${rounded}`,
        blurMap[blur],
        border && "border border-white/20",
        shadow && "shadow-xl",
        animated && "animate-pulse",
        className,
      )}
    >
      {/* Animated gradient overlay */}
      {animated && (
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      )}
      {children}
    </div>
  );
}
