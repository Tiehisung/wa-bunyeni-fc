// components/Glassmorphic/Glassmorphic.tsx
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassmorphicProps {
  children: ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg" | "xl" | "none";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  border?: boolean;
  shadow?: boolean;
  background?: string;
  borderColor?: string;
  hoverEffect?: boolean;
  interactive?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
}

const blurMap = {
  none: "backdrop-blur-none",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
};

const roundedMap = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export function Glassmorphic({
  children,
  className,
  blur = "md",
  rounded = "lg",
  border = true,
  shadow = true,
  background = "bg-accent/10 dark:bg-secondary/10",
  borderColor = "border-accent/20 dark:border-accent/10",
  hoverEffect = false,
  interactive = false,onClick
}: GlassmorphicProps) {
  return (
    <div
      className={cn(
        // Base styles
        "transition-all duration-300",
        blurMap[blur],
        roundedMap[rounded],
        background,
        border && `border ${borderColor}`,
        shadow && "shadow-lg",
        // Hover effects
        hoverEffect && "hover:scale-105 hover:shadow-xl",
        interactive &&
          "cursor-pointer hover:bg-accent/20 dark:hover:bg-secondary/20",
        className,
      )}

      onClick={onClick}
    >
      {children}
    </div>
  );
}
