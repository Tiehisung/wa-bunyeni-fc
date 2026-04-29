"use client";

import { FaArrowLeft } from "react-icons/fa";
import { Button } from "./Button";
import { TButtonSize, TButtonVariant } from "../ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
 

/**
 *
 * @param {*} className  [Optional] Apply custom styles
 * @param {*} link [Optional] Link to return to if preffered
 * @returns
 */
interface BackBtnProps {
  className?: string;
  link?: string;
  label?: string;
  variant?: TButtonVariant;
  size?: TButtonSize;
  onClick?: () => void;
}

export default function BackBtn({
  className = "",
  link = "",
  label = "",
  variant,
  size = "icon",
  onClick,
}: BackBtnProps) {
  const router = useRouter();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => {
        if (link) {
          router.replace(link,  );
          return;
        }

        if (typeof onClick !== "undefined") {
          onClick();
          return;
        }

        router.back();
      }}
      className={cn(
        `_shrink _hover flex items-center gap-2 ml-6 group w-fit bg-muted text-muted-foreground px-3 rounded-full`,
        className,
      )}
    >
      <FaArrowLeft className="group-hover:scale-105 group-hover:-translate-x-1 transition-all duration-300" />{" "}
      {label}
    </Button>
  );
}
