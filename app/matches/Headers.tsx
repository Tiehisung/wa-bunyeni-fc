"use client";

import { ISelectOptionLV } from "@/types";
 
import { useEffect, useState } from "react";
import { useSearchParams } from "@/lib/searchParams";

interface HeaderLinksProps {
  query: string;
  options: ISelectOptionLV[];
  className?: string;
  wrapperStyles?: string;
}

export const SearchQueryUpdator = ({
  options,
  className,
  wrapperStyles,
  query,
}: HeaderLinksProps) => {
  const [selectedKey, setSelectedKey] = useState<string>("");
 
  const { setSearchParams } = useSearchParams();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const value = searchParams.get(query);
    setSelectedKey(value || "");
  }, [window.location.search, query]);

  const handleUpdateQuery = (val: string) => {
    setSearchParams(query, val);
  };

  return (
    <div
      className={`flex items-center flex-wrap gap-y-1 gap-x-1.5 ${wrapperStyles || ""}`}
    >
      {options?.map(({ label, value }, i) => {
        return (
          <button
            onClick={() => handleUpdateQuery(value)}
            key={i}
            className={`border border-border rounded-full px-3 py-1 text-xs bg-popover hover:bg-card cursor-pointer transition-transform capitalize ${
              selectedKey === value ? "ring-1" : ""
            } ${className || ""}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
