"use client";

import useGetParam, { useUpdateSearchParams } from "@/hooks/params";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { ReactNode, useEffect, useState } from "react";
import Loader from "../loaders/Loader";
import { cn } from "@/lib/utils";
import { OverlayLoader } from "../loaders/OverlayLoader";

export interface SelectOption {
  label: string;
  value: string;
}

interface ISelect {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  triggerStyles?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  paramKey?: string;
  label?: ReactNode;
  error?: string;
  clearable?: boolean;
  loading?: boolean;
}

// Primary Select (like your PrimaryDropdown)
export function PrimarySelect({ clearable = true, ...props }: ISelect) {
  const { setParam } = useUpdateSearchParams();
  const paramValue = useGetParam(props.paramKey as string);

  const [refreshing, setRefreshing] = useState(false);

  // Refresh when paramValue is cleared
  useEffect(() => {
    if (!paramValue) {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
      }, 50);
    }
  }, [paramValue]);

  const handleOnChange = (val: string) => {
    const value = val === "all" ? "" : val;
    if (props.onChange) {
      props.onChange(value);
    } else {
      if (props.paramKey) setParam(props.paramKey as string, value);
    }
  };
  const normalizedValue =
    !props.value || props.value === "all" ? undefined : props.value;

  if (refreshing) return <Loader />;

  return (
    <div>
      {props.label && (
        <Label
          htmlFor={props.name}
          className="_label mb-2 text-muted-foreground"
        >
          {props.label}
        </Label>
      )}

      <Select
        value={normalizedValue}
        onValueChange={handleOnChange}
        name={props.name}
        required={props.required}
      >
        <SelectTrigger
          disabled={props.disabled}
          className={`bg-input dark:bg-input ${props.triggerStyles}`}
          id={props.name}
        >
          <SelectValue placeholder={props.placeholder ?? "Select"} />
        </SelectTrigger>
        <SelectContent className={props.className}>
          {clearable && (
            <SelectItem value="all">
              <span className="text-muted-foreground">All</span>
            </SelectItem>
          )}
          {props?.options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {props.error && (
        <p className={` text-red-500 text-left text-sm mt-1 font-light`}>
          {props.error}
        </p>
      )}
      {props.loading && <OverlayLoader isLoading />}
    </div>
  );
}

interface ISELECT {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  selectStyles?: string;
  loading?: boolean;
  name?: string;
  paramKey?: string;
  label?: ReactNode;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  modern?: boolean;
}

export default function SELECT({
  options,
  name,
  value,
  error,
  onChange,
  label,
  className,
  paramKey,
  selectStyles,
  loading,
  modern = true,
  placeholder,
  ...props
}: ISELECT) {
  const { setParam } = useUpdateSearchParams();

  const defaultSP = useGetParam(paramKey as string);

  // Get the actual selected value
  const selectedValue = value !== undefined ? value : defaultSP;

  const handleOnChange = (val: string) => {
    if (typeof onChange !== "undefined") {
      onChange(val);
    } else {
      if (paramKey) setParam((paramKey as string) ?? "filter", val);
    }
  };
  const getDisplayValue = () => {
    // Return undefined when no selection, not empty string
    if (
      selectedValue === undefined ||
      selectedValue === null ||
      selectedValue === ""
    ) {
      return undefined;
    }
    return selectedValue;
  };
  if (modern) {
    return (
      <div
        className={cn(
          "flex items-center group relative focus-within:ring-2 ring-primary border border-gray-300 rounded-lg h-13 ",
          className,
        )}
      >
        <label
          hidden={!label}
          htmlFor={name}
          className={cn(
            `absolute top-2 left-4 text-muted-foreground group-focus-within:top-2 group-focus-within:text-sm group-focus-within:text-primary transition-all duration-300 ease-out -translate-y-1/2 text-sm font-medium `,
          )}
        >
          {label}
        </label>

        <select
          value={getDisplayValue()}
          name={name}
          id={name}
          onChange={(e) => handleOnChange?.(e.target.value)}
          className={cn(
            `w-full h-full rounded-lg pb-0 pt-2 px-4 focus:outline-none outline-0 font-[350]`,
            selectStyles,
          )}
          {...props}
        >
          <option value="" className="bg-accent">
            -- {placeholder || "Select an option"} --
          </option>
          {options?.map((op, i) => (
            <option
              key={i}
              value={op.value}
              selected={op.value == (value || defaultSP)}
              className="bg-accent"
            >
              {op.label}
            </option>
          ))}
        </select>
        {error && (
          <p
            className={`absolute -bottom-3 left-2 text-red-500  line-clamp-2 text-[9px] `}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
  return (
    <>
      <div className={cn("flex items-center gap-2 relative", className)}>
        {label && (
          <Label htmlFor={name} className="_label text-muted-foreground">
            {label}
          </Label>
        )}
        <select
          value={value || defaultSP}
          onChange={(e) => handleOnChange?.(e.target.value)}
          className={cn(
            `bg-input text-sm border px-2 h-9 border-input rounded py-2
    focus:outline-none focus:ring-2 focus:ring-primary
    disabled:cursor-not-allowed disabled:opacity-50`,
            selectStyles,
          )}
          {...props}
        >
          <option value="" hidden>
            {placeholder}
          </option>
          {options?.map((op, i) => (
            <option
              key={i}
              value={op.value}
              selected={op.value == (value || defaultSP)}
              className="bg-accent"
            >
              {op.label}
            </option>
          ))}
        </select>

        {loading && <OverlayLoader isLoading />}
      </div>
      {error && (
        <p
          className={` text-destructive text-left text-sm font-light line-clamp-2`}
        >
          {error}
        </p>
      )}
    </>
  );
}
