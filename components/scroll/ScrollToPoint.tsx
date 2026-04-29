"use client";

import { FaArrowUp } from "react-icons/fa";

interface ScrollToPointCpProps {
  sectionId: string;
  className?: string;
}

export default function ScrollToPointCp({
  sectionId,
  className = " absolute",
}: ScrollToPointCpProps) {
  const handleScrollToPoint = () => {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <button
      title="Scroll"
      onClick={handleScrollToPoint}
      className={`_secondaryBtn rounded-lg shadow-lg bottom-2 right-3 p-3 bg-green-300 hidden group-hover:flex text-xs ${className}`}
    >
      <FaArrowUp />
    </button>
  );
}
interface ScrollToPointBtnProps {
  sectionId: string;
  className?: string;
  children?: React.ReactNode;
  label?: string;
  title?: string;
}

export function ScrollToPointBtn({
  sectionId,
  className = "",
  children,
  label,
  title = "",
}: ScrollToPointBtnProps) {
  const handleScrollToPoint = () => {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <button
      title={title}
      type="button"
      onClick={handleScrollToPoint}
      className={`cursor-pointer ${className}`}
    >
      {children} {label}
    </button>
  );
}
