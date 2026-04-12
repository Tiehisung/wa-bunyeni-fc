 "use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IInputProps {
  name: string;
  placeholder?: string;
  value?: string | number;
  setEvent?: boolean;
  dataTip?: string;
  others?: object;
  required?: boolean;
  className?: string;
  wrapperStyles?: string;
  labelStyles?: string;
  labelStylesFocus?: string;
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}
export function INPUT(props: IInputProps) {
  return (
    <div className={`flex flex-col gap-3 ${props.wrapperStyles}`}>
      <Label htmlFor={props.name} className="px-1" hidden={!props.label}>
        {props.label}
      </Label>
      <Input
        type={props.type ?? "text"}
        id={props.name}
        step={props.type == "time" ? "1" : ""}
        required={props.required ?? false}
        // defaultValue={ props.type == "time" ? "10:30:00" : props.value}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => {
          props.onChange(e);
        }}
        className={`bg-input appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${props.className}`}
      />
      {props.error && (
        <p className={` text-red-500  text-sm mt-1`}>{props.error}</p>
      )}
    </div>
  );
}
