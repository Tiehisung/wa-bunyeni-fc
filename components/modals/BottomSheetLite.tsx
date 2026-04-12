 "use client";

import React, { ReactNode, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import DiveUpwards from "../Animate";
import { useActionOnEsc } from "@/hooks/Esc";

interface Props {
  children: ReactNode;
  className?: string;
  wrapperStyles?: string;
  allowOverlayClose?: boolean;
  id: string;
  trigger: ReactNode;
  triggerStyles?: string;
  isPreparing?: boolean;
  y?: number;
  closeOnEscape?: boolean;
}

const BottomSheetLite: React.FC<Props> = ({
  children,
  className,
  wrapperStyles,
  allowOverlayClose = true,
  id = "BSModal",
  trigger = "toggle",
  triggerStyles,
  isPreparing,
  y = 30,
  closeOnEscape = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useActionOnEsc({
    onEscape() {
      if (closeOnEscape) setIsOpen(false);
    },
  });


  return (
    <>
      <div
        id={id}
        onClick={() => setIsOpen((p) => !p)}
        className={`line-clamp-3 cursor-pointer flex items-center gap-4 ${
          isPreparing ? "pointer-events-none" : ""
        } ${triggerStyles}   `}
      >
        {isPreparing ? (
          <VscLoading className="spin min-h-5 min-w-5" />
        ) : (
          trigger
        )}
      </div>

      {isOpen && (
        <div style={{inset:'0'}}
          onClick={() => {
            if (allowOverlayClose) setIsOpen((p) => !p);
          }}
          className={`fixed inset-0  bg-modalOverlay backdrop-blur-sm flex flex-col justify-end z-50 ${wrapperStyles}`}
        >
          <DiveUpwards
            layoutId={`pmod${id}`}
            y={y}
            duration="0.05"
            className={` shadow-2xl relative bg-popover rounded-t-2xl w-full space-y-2 `}
          >
            <hr className='h-1.5 w-16 rounded-full bg-border mx-auto'/>
            <div
              className={`mt-auto md:min-w-100 grow max-h-[90vh] min-h-48 h-fit overflow-y-auto p-6 pb-20 ${className}`}
            >
              {children}
            </div>
          </DiveUpwards>
        </div>
      )}
    </>
  );
};

export default BottomSheetLite;

export interface IModalContext {
  new: string;
  edit: string;
  neutral: string;
  delete: string;
}
export const actionEffects = {
  new: "success",
  edit: "btn",
  neutral: "bodyText",
  delete: "error",
};
