 

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";
import { TButtonSize, TButtonVariant } from "./ui/button";
import { Button } from "./buttons/Button";
import Loader from "./loaders/Loader";
import { cn } from "@/lib/utils";
import {usePathname, useRouter}from 'next/navigation'

interface ICollapsible {
  header: {
    icon?: ReactNode;
    label: ReactNode;
    path?: string;
    className?: string;
    others?: object;
  };
  children: ReactNode;
  isMinimize?: boolean;
  onChange?: (arg: boolean) => void;
  variant?: TButtonVariant;
  size?: TButtonSize;
  loading?: boolean;
  defaultOpen?: boolean;
}

export function PrimaryCollapsible({
  children,
  header,
  isMinimize,
  onChange,
  variant = "ghost",
  size,
  loading,
  defaultOpen,
}: ICollapsible) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const pathname = usePathname();
  const isActiveLink = (path: string) => pathname === path;
  const router = useRouter();
  if (loading) return <Loader />;
  return (
    <div className="space-y-1 w-full ">
      <Button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (typeof onChange == "function") onChange(!isOpen);
          if (header.path) router.push(header.path);
        }}
        className={cn(
          `w-full flex items-center justify-between p-3 pr-0 rounded-lg _transition ${
            isActiveLink(header?.path || "")
              ? "text-primary"
              : ""
          }  ${isOpen ? "rounded-b-none ring" : ""}`,
          header?.className
        )}
        {...header?.others}
        variant={variant}
        size={size}
      >
        <div className="flex items-center gap-3 grow">
          <span className="shrink-0">{header?.icon}</span>
          <AnimatePresence>
            {!isMinimize && (
              <motion.div
                variants={contentVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className=""
              >
                {header.label}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {!isMinimize && (
            <motion.div
              variants={contentVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="_hover p-2 mr-0"
            >
              <ChevronDown
                size={16}
                className={`_slowTrans ${isOpen ? "" : "-rotate-90"}`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {!isMinimize && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className=" space-y-1 border-l border-border/50 pl-4 pt-4 mb-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const contentVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      delay: 0.1,
    },
  },
  closed: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
    },
  },
};
