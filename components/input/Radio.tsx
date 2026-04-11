 

import   { FC, ReactNode, useEffect, useState } from "react";

interface RadioButtonsProps {
  values: string[];
  defaultValue: string;
  wrapperStyles?: string;
  className?: string;
  label?: ReactNode;
  setSelectedValue: (arg: string) => void;
}

const RadioButtons: FC<RadioButtonsProps> = ({
  values,
  defaultValue,
  wrapperStyles,
  className,
  setSelectedValue,
  label, 
}) => {
  const [option, setOption] = useState(defaultValue ?? "");
  useEffect(() => {
    if (typeof setSelectedValue !== "undefined") {
      setSelectedValue(option);
    }
  }, [option, defaultValue]);
  return (
    <div>
      {label && <div className="_label mb-2">{label}</div>}
      <div className={`select-none ${wrapperStyles}`}>
        {values.map((val, i) => (
          <button
            type="button"
            key={i}
            className={`flex items-center gap-3 border border-muted-foreground/50 cursor-pointer py-1.5 pl-2 pr-5 rounded-full _hover _slowTrans capitalize ${
              option == val && "border-primary pointer-events-none text-primary"
            } ${className}`}
            onClick={() => {
              setOption(val);
              setSelectedValue(val);
            }}
          >
            <span
              className={` rounded-full border border-muted-foreground/50  ${
                option == val ? "bg-primary w-5 h-5" : "invisible"
              }`}
            ></span>
            <span> {val}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RadioButtons;
