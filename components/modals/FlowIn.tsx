 

import  { ReactNode, useState } from "react";
import HideOnClickOutside from "../HideOnClickOutside";
import CloseButton from "../buttons/Close";

interface FlowInPopperProps {
  children: ReactNode;
  trigger?: ReactNode;
  className?: string;
  wrapperStyles?: string;
}

const FlowInPopper = ({
  children,
  className,
  trigger,
  wrapperStyles,
}: FlowInPopperProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div
        role="button"
        onClick={() => setIsOpen((p) => !p)}
        className={`flex items-center p-2 text-green-600 bg-base-200 border rounded transform ease-in duration-300 ${className}`}
      >
        {trigger ?? "Open"}
      </div>

      <HideOnClickOutside
        className={`z-20 fixed top-20 h-[80vh] overflow-y-auto bg-popover p-1 max-w-100 w-fit shadow-xl transition-all duration-200  ${
          isOpen ? " right-2 " : "-right-full"
        } ${wrapperStyles}`}
        setIsVisible={setIsOpen}
      >
        <CloseButton
          className="absolute left-1 top-1"
          onClose={() => setIsOpen(false)}
        />
        {children}
      </HideOnClickOutside>
    </>
  );
};

export default FlowInPopper;
