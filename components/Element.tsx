import { ReactNode } from "react";
import { cn } from "@/lib/utils";
 

export default function HEADER({
  subtitle,
  title,
  children,
  className = "",
}: {
  title?: ReactNode;
  subtitle?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <header
      className={cn(`border-b border-border grow mb-6 pb-2`, "pt-4", className)}
    >
      <div className={`mx-auto`}>
        <div className="font-semibold text-xl md:text-2x ">
          {title}
        </div>
        {subtitle && (
          <p
            className={`font-normal text-sm text-muted-foreground  `}
          >
            {subtitle}
          </p>
        )}
      </div>
      <div>{children}</div>
    </header>
  );
}

interface IProps {
  text: string;
  icon?: React.ReactNode;
}

export function TITLE({ text, icon }: IProps) {
  return (
    <div className="flex items-center gap-3.5 group">
      {icon && (
        <span className="text-2xl text-muted-foreground group-hover:text-foreground">
          {icon}
        </span>
      )}
      <h1
        className={cn(
          "font-bold text-[20px] leading-7",
          "font-ibarra-real-nova",
        )}
      >
        {text}
      </h1>
    </div>
  );
}

export function H({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 my-4 font-semibold text-3xl tracking-wide">
      {children}
    </div>
  );
}
