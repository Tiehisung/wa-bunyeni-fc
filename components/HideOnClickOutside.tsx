"use client";

import { useEffect, useRef } from "react";

interface ClickOutsideWrapperProps {
  children: React.ReactNode;
  className?: string;
  setIsVisible: (arg: boolean) => void;
  others?: object;
}

const HideOnClickOutside: React.FC<ClickOutsideWrapperProps> = ({
  children,
  className = " z-30 ",
  setIsVisible,
  others,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={className} {...others}>
      {children}
    </div>
  );
};

export default HideOnClickOutside;
