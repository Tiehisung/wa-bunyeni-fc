"use client";

import { CSSProperties, MouseEventHandler } from "react";
import { VscLoading } from "react-icons/vsc";
import { TButtonSize, TButtonVariant, Button as Btn } from "../ui/button";

interface ButtonProps {
  primaryText?: string;
  waiting?: boolean;
  waitingText?: string;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  type?: "submit" | "button" | "reset";
  styles?: CSSProperties;
  variant?: TButtonVariant;
  size?: TButtonSize;
  id?: string;
}

interface ClickButtonProps extends ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  title?: string;
}

export function Button({
  primaryText,
  waiting = false,
  className = "",
  disabled = false,
  type = "button",
  onClick,
  children,
  title = "",
  styles = {},
  variant,
  size,
  id,
}: ClickButtonProps) {
  return (
    <Btn
      disabled={waiting || disabled}
      className={`flex items-center gap-2 font-semibold disabled:pointer-events-none disabled:hover:bg-transparent disabled:opacity-60 active:scale-[99%] overflow-hidden ${className} ${
        waiting ? "cursor-wait" : "cursor-pointer"
      }  `}
      variant={variant}
      size={size}
      type={type}
      onClick={onClick}
      title={title}
      style={styles}
      id={id}
    >
      <span hidden={!primaryText}>{primaryText}</span>
      {waiting ? <VscLoading className={` animate-spin `} /> : children}
    </Btn>
  );
}
