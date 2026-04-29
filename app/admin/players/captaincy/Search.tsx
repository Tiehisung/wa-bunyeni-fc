"use client";

import { ClearFiltersBtn } from "@/components/buttons/ClearFilters";
import { PrimarySearch } from "@/components/Search";
import { useUpdateSearchParams } from "@/hooks/params";
import { ISelectOptionLV } from "@/types";

import { useEffect, useState } from "react";

export const SearchCaptains = () => {
  const { setParam } = useUpdateSearchParams();

  const options = [
    { value: "", label: "All" },
    { value: "current", label: "Current" },
    { value: "passed", label: "Passed Captains" },
  ];

  const [option, setOption] = useState<ISelectOptionLV | null>(options[0]);

  useEffect(() => {
    if (option?.value) setParam("captains", option?.value);
  }, [option]);

  const { clearParams } = useUpdateSearchParams();

  useEffect(() => {
    if (!option?.value) clearParams();
  }, [option]);

  return (
    <div className="flex flex-wrap w-fit items-center gap-4 grow">
      <PrimarySearch
        className="py-1 max-w-[80vw] grow"
        placeholder={`Search captains`}
        type="search"
        name="search"
        searchKey="captain_search"
      />

      <ul className=" text-xs text-secondary-foreground flex flex-wrap items-center gap-2  ">
        {options.map((opt) => {
          return (
            <li
              key={opt.value}
              className={`border rounded-full px-2 py-1 text-nowrap select-none cursor-pointer hover:bg-primary/20 transition-colors whitespace-nowrap
                ${
                  opt.value === option?.value
                    ? "bg-primary text-primary-foreground font-semibold hover:bg-primary"
                    : ""
                }`}
              onClick={() => setOption(opt)}
            >
              {opt.label}
            </li>
          );
        })}
      </ul>

      <ClearFiltersBtn />
    </div>
  );
};
