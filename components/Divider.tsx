"use client";
import type { ReactNode } from "react";

const Divider = ({
  content = "OR",
  className = " my-4",
  borderClassName = "border-border",
}: {
  content?: ReactNode;
  className?: string;
  borderClassName?: string;
}) => {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <hr className={`grow border-t  ${borderClassName}`} />
      <span className="px-4 _p">{content}</span>
      <hr className={`grow border-t ${borderClassName}`} />
    </div>
  );
};

export default Divider;
