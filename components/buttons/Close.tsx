"use client";

import { CgClose } from "react-icons/cg";

const CloseButton = ({
  className,
  onClose,
}: {
  className?: string;
  onClose: (arg: boolean) => void;
}) => {
  return (
    <button
      className={`w-fit text-primaryRed hover:text-[#e6caca] p-1 ${className}`}
      type="button"
    >
      <CgClose size={25} onClick={() => onClose(false)} className={``} />
    </button>
  );
};

export default CloseButton;
