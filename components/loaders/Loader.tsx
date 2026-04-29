'use client' 

import { icons } from "@/assets/icons/icons";
import React, { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";

/**
 *
 * @param message Any single string of message to render as loading is active.
 * @param messages Array of custom messages(strings) that will be iterated as loading in progress.
 * @returns
 */
const Loader: React.FC<{
  message?: string;
  messages?: string[];
  className?: string;

  size?: "xs" | "sm" | "md" | "lg" | "xl";
  icon?: "spiral" | "ring" | "cone-ring";
}> = ({
  message,
  className,

  messages = [],
  size = "sm",
  icon = "ring",
}) => {
  const [msgIndex, setMsgIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (messages?.length > 0) {
        if (msgIndex < messages?.length - 1) setMsgIndex((p) => p + 1);
        else setMsgIndex(0);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const _size = {
    xs: "size-4",
    sm: "size-6",
    md: "size-12",
    lg: "size-24",
    xl: "size-44",
  }[size];

  const Icon =
    icon == "ring" ? (
      <icons.loader className={`animate-spin ${_size}`} />
    ) : icon == "cone-ring" ? (
      <ImSpinner2 className={`animate-spin ${_size} `} />
    ) : (
      <icons.loaderSpiral className={`animate-spin ${_size} `} />
    );

  return (
    <div className={`flex gap-2 items-center justify-center ${className}`}>
      {Icon}
      <span>{message || messages?.[msgIndex]}</span>
    </div>
  );
};

export default Loader;
