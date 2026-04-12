'use client'
import { Fragment, type ReactNode } from "react";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
 

export interface DropdownItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  position?: "left" | "right";
  width?: "sm" | "md" | "lg" | "full";
  className?: string;
}

const widthClasses = {
  sm: "w-36",
  md: "w-48",
  lg: "w-64",
  full: "w-full",
};

export function Dropdown({
  trigger,
  items,
  position = "right",
  width = "md",
  className = "",
}: DropdownProps) {
  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      <Menu.Button as={Fragment}>{trigger}</Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute ${position === "right" ? "right-0" : "left-0"} z-50 mt-2 ${widthClasses[width]} origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none`}
        >
          <div className="px-1 py-1">
            {items.map((item, index) => (
              <Menu.Item key={index} disabled={item.disabled} >
                {({ active, disabled }) => {
                  const classes = `group flex w-full items-center rounded-md px-3 py-2 text-sm ${
                    active
                      ? item.danger
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-900"
                      : item.danger
                        ? "text-red-600"
                        : "text-gray-700"
                  } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`;

                  if (item.href) {
                    return (
                      <Link href={item.href} className={classes}>
                        {item.icon && (
                          <span className="mr-2 h-4 w-4">{item.icon}</span>
                        )}
                        {item.label}
                      </Link>
                    );
                  }

                  return (
                    <button
                      onClick={item.onClick}
                      disabled={disabled}
                      className={classes}
                    >
                      {item.icon && (
                        <span className="mr-2 h-4 w-4">{item.icon}</span>
                      )}
                      {item.label}
                    </button>
                  );
                }}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
