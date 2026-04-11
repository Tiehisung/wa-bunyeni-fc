"use client";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
type PrevNextBtnProps = {
  disabled?: boolean;
  styles?: string;
  handleClick?: () => void;
  label?: string;
  hideArrow?: boolean;
  title?: string;
};

export function PreviousBtn({
  disabled = false,
  styles,
  handleClick,
  label = "Previous",
  hideArrow = false,
  title = "",
}: PrevNextBtnProps) {
  return (
    <button
      disabled={disabled}
      className={`_secondaryBtn ${styles}`}
      onClick={handleClick}
      title={title}
      type="button"
    >
      <FaAngleLeft className={` ${hideArrow && "md:hidden"}`} />
      <span className="max-md:hidden">{label}</span>
    </button>
  );
}

export function NextBtn({
  disabled = false,
  styles,
  handleClick,
  label = "Next",
  hideArrow = false,
  title = "",
}: PrevNextBtnProps) {
  return (
    <button
      disabled={disabled}
      className={`_secondaryBtn ${styles}`}
      onClick={handleClick}
      title={title}
      type="button"
    >
      <FaAngleRight className={` ${hideArrow && "md:hidden"}`} />
      <span className="max-md:hidden">{label}</span>
    </button>
  );
}
