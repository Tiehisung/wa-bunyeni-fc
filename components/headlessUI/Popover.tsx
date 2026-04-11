// src/components/ui/Popover.tsx
import { Fragment, type ReactNode } from "react";
import { Popover as HeadlessPopover, Transition } from "@headlessui/react";

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  position?: "left" | "right" | "center";
  width?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  panelClassName?: string;
}

const widthClasses = {
  sm: "w-48",
  md: "w-64",
  lg: "w-80",
  xl: "w-96",
  full: "w-screen max-w-md",
};

const positionClasses = {
  left: "left-0",
  right: "right-0",
  center: "left-1/2 -translate-x-1/2",
};

export function Popover({
  trigger,
  children,
  position = "center",
  width = "md",
  className = "",
  panelClassName = "",
}: PopoverProps) {
  return (
    <HeadlessPopover className={`relative ${className}`}>
      {({}) => (
        <>
          <HeadlessPopover.Button as={Fragment}>
            {trigger}
          </HeadlessPopover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <HeadlessPopover.Panel
              className={`absolute z-50 mt-3 ${positionClasses[position]} ${widthClasses[width]} ${panelClassName}`}
            >
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                <div className="bg-white p-4">{children}</div>
              </div>
            </HeadlessPopover.Panel>
          </Transition>
        </>
      )}
    </HeadlessPopover>
  );
}
