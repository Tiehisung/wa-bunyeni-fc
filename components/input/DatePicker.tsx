 "use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type DatePickerProps = {
  value?: string | Date | null;
  onChange?: (date?: string) => void;
  label?: string;
  name: string;
  placeholder?: string;
  className?: string;
  defaultOpen?: boolean;
  error?: string;
};

export function DATEPICKER({
  value,
  onChange,
  label = "Date of birth",
  name = "date",
  placeholder = "Select date",
  className,
  defaultOpen = false,
  error,
}: DatePickerProps) {
  const [open, setOpen] = React.useState<boolean>(defaultOpen);
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    () => {
      if (typeof value === "string") {
        const d = new Date(value);
        return isNaN(d.getTime()) ? undefined : d;
      }
      return (value ?? undefined) as Date | undefined;
    }
  );

  React.useEffect(() => {
    if (typeof value === "string") {
      const d = new Date(value);
      setInternalDate(isNaN(d.getTime()) ? undefined : d);
    } else {
      setInternalDate(value ?? undefined);
    }
  }, [value]);

  const handleSelect = (date?: Date) => {
    setInternalDate(date);
    onChange?.(date?.toString());
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={name} className="px-1">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={name}
            className={`w-48 justify-between font-normal ${className ?? ""}`}
          >
            {internalDate ? internalDate.toLocaleString() : placeholder}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={internalDate}
            captionLayout="dropdown"
            onSelect={(date) => handleSelect(date as Date | undefined)}
          />
        </PopoverContent>
      </Popover>
      {error && <p className={` text-red-500  text-sm mt-1`}>{error}</p>}
    </div>
  );
}
