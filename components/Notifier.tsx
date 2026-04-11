 
import { ReactNode, useEffect, useState } from "react";
import DiveUpwards from "./Animate";
import CloseButton from "./buttons/Close";

interface INotifierProps {
  message: ReactNode;
  children?: React.ReactNode;
  className?: string;
  inDismissible?: boolean;
  delay?: "1m" | "30s" | "10s" | "5s" | "2s" | "0";
}
const NotifierWrapper = ({
  message,
  children,
  className,
  delay = "2s",
  inDismissible,
}: INotifierProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const elapse =
      delay == "1m"
        ? 10000
        : delay == "30s"
        ? 30000
        : delay == "10s"
        ? 10000
        : delay == "5s"
        ? 5000
        : delay == "2s"
        ? 2000
        : delay == "0"
        ? 0
        : 0;
    const timeout = setTimeout(() => {
      setIsOpen(true);
    }, elapse);
    return () => clearTimeout(timeout);
  }, []);

  if (!isOpen) return null;

  return (
    <DiveUpwards
      layoutId={message?.toString() as string}
      className={`relative w-full flex gap-6 items-start justify-between border-green-200 bg-green-700/5 bg-opacity-10 p-4 rounded-lg shadow-sm border ${className}`}
    >
      <div className="grid gap-3 grow">
        <p className="font-normal text-sm min-h-6">{message}</p>
        {children}
      </div>

      {inDismissible && (
        <CloseButton
          onClose={() => setIsOpen(false)}
          className="absolute right-1 top-1"
        />
      )}
    </DiveUpwards>
  );
};

export default NotifierWrapper;
