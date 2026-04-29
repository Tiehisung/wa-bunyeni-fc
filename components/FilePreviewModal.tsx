"use client";

import { ReactNode } from "react";

import { getFileExtension, openFileInTab } from "@/lib/file";
import { SideDrawer } from "./ShadSideDrawer";
import { Button, TButtonVariant } from "./ui/button";

interface IProps {
  url: string;
  title: string;
  trigger?: ReactNode;
  className?: string;
  type?: "image" | "video" | "pdf" | "any";
  fileClassName?: string;
  modalClassName?: string;
  variant?: TButtonVariant;
}

const FileViewer = ({
  url,
  trigger = "Preview",
  className = " ",
  type = "any",
  fileClassName,
  modalClassName = "z-[100]",
  variant = "ghost",
}: IProps) => {
  //Open all pdf in new tab for small screen
  const extension = getFileExtension(url);

  if (!url)
    return (
      <p className="text-destructive italic font-light text-sm line-through">
        File not available
      </p>
    );

  if (extension.includes("pdf")) {
    return (
      <Button
        onClick={() => openFileInTab(url)}
        className={`flex items-center gap-1 cursor-pointer ${className}`}
        title="Open file"
        variant={variant}
      >
        {trigger}
      </Button>
    );
  }
  return (
    <SideDrawer
      id={`${url}`}
      trigger={trigger}
      className={`relative ${modalClassName}`}
      side="bottom"
      variant={variant}
    >
      {type == "image" && (
        <img
          alt=""
          src={url}
          className={fileClassName}
          width={500}
          height={500}
        />
      )}
      {type == "video" && <video src={url} className={fileClassName} />}
      {(type == "pdf" || type == "any") && (
        <>
          <iframe
            src={url}
            className={`min-h-[80vh] h-fit min-w-[75vw] w-fit aspect-square z-1 ${fileClassName}`}
          />
        </>
      )}
    </SideDrawer>
  );
};

export default FileViewer;
