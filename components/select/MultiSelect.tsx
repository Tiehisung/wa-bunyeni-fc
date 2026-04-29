'use client'

import { useUpdateSearchParams } from "@/hooks/params";
import { ISelectOptionLV } from "@/types";
import { ReactNode, useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { Button } from "../buttons/Button";
import { useSearchParams } from "next/navigation";
 
interface IProps {
  options?: ISelectOptionLV[];
  onChange?: (arg: ISelectOptionLV[]) => void;
  name: string;
  label?: ReactNode;
  className?: string;
  wrapperStyles?: string;
  initialOptions?: Array<string>;
}

const MultiSelectionInput = ({
  options,
  onChange,
  name,
  label,
  className,
  wrapperStyles,
  initialOptions,
}: IProps) => {
 
  const searchParams = useSearchParams()
  const [selectedOptions, setSelectedOptions] = useState<ISelectOptionLV[]>([]);

  function handleChangeOption(option: ISelectOptionLV) {
    if (selectedOptions.find((op) => op.value === option.value)) {
      setSelectedOptions([
        ...selectedOptions.filter((o) => o.value !== option.value),
      ]);
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  }

  // Initialize from URL params
  useEffect(() => {
    const _value = searchParams.get(name);
    if (_value) {
      const values = _value
        ?.split(",")
        .map((v) => options?.find((o) => o?.value === v) as ISelectOptionLV)
        .filter(Boolean);
      setSelectedOptions(values);
    } else if (initialOptions) {
      setSelectedOptions(
        options?.filter((o) => initialOptions.includes(o.value)) ?? [],
      );
    }
  }, [searchParams, initialOptions, name, options]);

  // Export changes
  const { setParam } = useUpdateSearchParams();

  useEffect(() => {
    if (typeof onChange !== "function") {
      setParam(name, selectedOptions.map((o) => o.value).join(","));
    } else {
      onChange(selectedOptions);
    }
  }, [selectedOptions, name, onChange,]);

  if (!options) return null;

  return (
    <div className={`border border-border rounded-lg p-3 ${wrapperStyles}`}>
      {label && <div className="_label mb-2.5">{label}</div>}

      <div className="flex flex-wrap gap-x-3 gap-y-1 p-3">
        {options?.map((option, index) => {
          const isSelected = selectedOptions?.find(
            (op) => op.value === option.value,
          );
          return (
            <Button
              key={index}
              onClick={() => handleChangeOption(option)}
              primaryText={option.label}
              className={`${className} rounded-full capitalize font-light text-sm w-fit px-2 py-1 text-center justify-center border _transition cursor-pointer select-none`}
              variant={isSelected ? "default" : "ghost"}
            >
              {isSelected && <MdCheckCircle size={20} className="text-Red" />}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MultiSelectionInput;
