// src/components/ui/SimpleDropdown.tsx
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SimpleDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  label?: string;
}

export function SimpleDropdown({
  value,
  onChange,
  options = Array.from({ length: 5 }).map((op) => ({ label: `label ${op}` ,value:`${op}`})),
  label,
}: SimpleDropdownProps) {
  const selectedOption = options?.find((opt) => opt.value === value);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {selectedOption?.icon && <span>{selectedOption.icon}</span>}
          {selectedOption?.label || label}
          <ChevronDown
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {options.map((option) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button
                    onClick={() => onChange(option.value)}
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } group flex w-full items-center px-4 py-2 text-sm ${
                      value === option.value ? "bg-blue-50 text-blue-600" : ""
                    }`}
                  >
                    {option.icon && <span className="mr-3">{option.icon}</span>}
                    {option.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
