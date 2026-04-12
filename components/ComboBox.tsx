 "use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ISelectOptionLV } from "@/types";
import useGetParam, { useUpdateSearchParams } from "@/hooks/params";
import Loader from "./loaders/Loader";

interface IComboProps {
  options: ISelectOptionLV[];
  placeholder?: string;
  onChange?: (option: ISelectOptionLV) => void;
  name?: string;
  defaultOptionValue?: string;
  className?: string;
  isLoading?: boolean;
}

export function COMBOBOX({
  options = [],
  placeholder = "Search…",
  onChange,
  name = "comboValue",
  defaultOptionValue = "",
  className = "",
  isLoading,
}: IComboProps) {
  const [open, setOpen] = React.useState(false);
  const { setParam } = useUpdateSearchParams();

  // URL parameter value
  const paramValue = useGetParam(name) ?? "";

  // internal state
  const [value, setValue] = React.useState("");

  /* ---------------------------
      INITIALIZATION SYNC
  ---------------------------- */
  React.useEffect(() => {
    const initial = defaultOptionValue || paramValue || "";

    setValue(initial);
  }, [defaultOptionValue, paramValue]);

  /* ---------------------------
        HANDLER
  ---------------------------- */
  const handleSelect = (currentValue: string) => {
    const selectedOption =
      options.find((o) => o.value === currentValue) ?? null;

    // update internal state
    setValue(currentValue);

    // update URL param if no onChange provided
    if (!onChange && selectedOption) {
      setParam(name, currentValue);
    }

    // trigger external handler
    if (onChange && selectedOption) {
      onChange(selectedOption);
    }

    setOpen(false);
  };

  const selectedLabel =
    options?.find((o) => o.value === value)?.label || placeholder;

  if (isLoading) return <Loader />;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={` justify-between grow ${className}`}
        >
          {selectedLabel}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className=" p-0">
        <Command>
          <CommandInput placeholder="Search option..." className="h-9" />

          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                >
                  {option.label}

                  <Check
                    className={cn(
                      "ml-auto transition-opacity",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
