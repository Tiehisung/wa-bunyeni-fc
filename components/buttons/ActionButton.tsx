 "use client";



import { Button } from "@/components/buttons/Button";
import { fireEscape } from "@/hooks/Esc";
import { apiConfig } from "@/lib/configs";

 
import React, { CSSProperties, ReactNode, useState } from "react";
import { toast } from "sonner";
import { TButtonSize, TButtonVariant } from "../ui/button";
import { getErrorMessage } from "@/lib/error";
 

interface IProps {
  className?: string;
  variant?: TButtonVariant;
  size?: TButtonSize;
  primaryText?: string;
  loadingText?: string;
  children?: ReactNode;
  uri?: string;
  method: "PUT" | "POST" | "DELETE" | "GET";
  body?: object;
  escapeOnEnd?: boolean;
  disabled?: boolean;
  styles?: CSSProperties;
  disableToast?: boolean;
  id?:string
}

export function ActionButton({
  variant,
  className,
  method = "GET",
  body,
  children,
  loadingText,
  uri,
  primaryText,
  escapeOnEnd = false,
  styles = {},
  disabled = false,
  disableToast,
  size,id
}: IProps) {
 
  const [waiting, setWaiting] = useState(false);


  const handleAction = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setWaiting(true);
      const response = await fetch(
        uri?.startsWith(apiConfig.base)
          ? uri
          : uri?.startsWith("/")
          ? `${apiConfig.base}${uri}`
          : `${apiConfig.base}/${uri}`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          cache: "no-cache",
          body: JSON.stringify({ ...body,  }),
        }
      );
      const results = await response.json();
      if (!disableToast) toast.success(results.message);
      setWaiting(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setWaiting(false);
       
      if (escapeOnEnd) fireEscape();
    }
  };
  return (
    <Button
      waiting={waiting}
      disabled={disabled || waiting}
      primaryText={primaryText}
      waitingText={loadingText}
      onClick={handleAction}
      className={`${className} `}
      styles={styles}
      variant={variant}
      size={size}
      id={id}
    >
      {children}
    </Button>
  );
}
