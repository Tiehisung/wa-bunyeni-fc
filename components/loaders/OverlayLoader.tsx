import { cn } from "@/lib/utils";
import { VscLoading } from "react-icons/vsc";

interface IOverlayLoader {
  isLoading?: boolean;
  iconClassName?: string;
  className?: string;
  message?: string;
  blur?: boolean;
}

export function OverlayLoader({
  isLoading = true,
  iconClassName = "text-4xl",
  className,
  message,
  blur = true,
}: IOverlayLoader) {
  if (!isLoading) return null;
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        `fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none`,
        blur ? "bg-modalOverlay/20 backdrop-blur-[1px]" : "",
        className,
      )}
    >
      {message && (
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          {message}
        </p>
      )}
      <VscLoading className={`animate-spin ${iconClassName}`} />
    </div>
  );
}
