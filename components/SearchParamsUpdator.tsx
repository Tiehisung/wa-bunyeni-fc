"use client";

import { useUpdateSearchParams } from "@/hooks/params";
import { useSearchParams } from "next/navigation";

interface IQueryOption {
  label: string;
  value: string;
  query: string;
}

interface HeaderLinksProps {
  options: IQueryOption[];
  className?: string;
  wrapperStyles?: string;
}

export const QueryUpdator = ({
  options,
  className,
  wrapperStyles,
}: HeaderLinksProps) => {
  const searchParams = useSearchParams();
  const { setParam } = useUpdateSearchParams();

  const handleUpdateQuery = (option: IQueryOption) => {
    setParam(option.query, option.value);
  };

  return (
    <div
      className={`flex items-center flex-wrap gap-y-1 gap-x-1.5 ${wrapperStyles || ""}`}
    >
      {options?.map((option, i) => {
        const isActive = searchParams.get(option.query) === option.value;

        return (
          <button
            onClick={() => handleUpdateQuery(option)}
            key={i}
            className={`border border-border rounded-full px-3 py-1 text-xs bg-popover hover:bg-card cursor-pointer transition-transform capitalize ${
              isActive ? "ring-1" : ""
            } ${className || ""}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
