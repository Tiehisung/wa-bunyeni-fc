 
'use client'

import { ReactNode, Dispatch, SetStateAction } from "react";

interface PopupTransBgProps {
  children: ReactNode;
  isOpenPopup: boolean;
  setIsOpenPopup: Dispatch<SetStateAction<boolean>>;
  childStyles?: {
    open: string;
    close: string;
  };
}

export default function PopupTransBg({
  children,
  isOpenPopup,
  setIsOpenPopup,
  childStyles = {
    open: "absolute top-full right-0 transform scale-105",
    close: "absolute -top-full right-0 invisible",
  },
}: PopupTransBgProps) {
  return (
    <div
      onClick={() => setIsOpenPopup(false)}
      className={`fixed inset-0 z-30  ${isOpenPopup ? "visible" : "invisible"}`}
    >
      <div
        className={`z-40 transition-all delay-200 duration-200 ${
          isOpenPopup ? childStyles.open : childStyles.close
        } `}
      >
        {children}
      </div>
    </div>
  );
}
