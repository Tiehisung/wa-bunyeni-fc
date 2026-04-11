// src/components/ui/Checkbox.tsx
import React from "react";
import { cn } from "../../lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

export const CHECKBOX = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, wrapperClassName, ...props }, ref) => {
    return (
      <div className={cn("w-full ", wrapperClassName)}>
        <label className="flex items-center gap-x-2">
          <input
            type="checkbox"
            ref={ref}
            className={cn("rounded border-gray-300 ", className)}
            {...props}
          />
          {label && <span className="text-sm ">{label}</span>}
        </label>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

CHECKBOX.displayName = "Checkbox";
