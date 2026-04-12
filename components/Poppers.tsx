 'use client'


import { FC, ReactNode, useState } from 'react';
import HideOnClickOutside from './HideOnClickOutside';
import { LuEllipsisVertical } from "react-icons/lu";
/**
 *
 * @param children Any nested component to be rendered.
 * @returns
 */

export const PopperToLeft: FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <HideOnClickOutside
      setIsVisible={setIsOpen}
      className={` relative w-fit flex items-center justify-center px-3 h-full ${!isOpen ? 'z-0 h-0 overflow-hidden' : 'z-40'}`}
    >
      <LuEllipsisVertical
        className={`h-8 w-8 hover:bg-lightGrey/40 slowTrans right-2 top-2 rounded-full p-2 cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      />

      <div
        className={`fixed top-auto right-auto grid border _borderColor _secondaryBg rounded-md min-w-32 overflow-hidden mt-2 mr-2 _shadow py-3 cursor-auto ${isOpen ? 'z-20 visible slowTrans top-1/3 right-6' : 'invisible h-0 top-4 z-0 '}`}
      >
        {children ?? 'Testing ...'}
      </div>
    </HideOnClickOutside>
  );
};
