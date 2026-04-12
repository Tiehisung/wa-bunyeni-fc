"use client";

import { useState, useEffect, type RefObject } from "react";

type OverflowDirection = "horizontal" | "vertical";

export function useOverflow(
  ref: RefObject<HTMLElement | null>,
  direction: OverflowDirection = "horizontal",
): boolean {
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const checkOverflow = () => {
      if (direction === "horizontal") {
        setIsOverflowing(el.scrollWidth > el.clientWidth);
      } else {
        setIsOverflowing(el.scrollHeight > el.clientHeight);
      }
    };

    checkOverflow(); // initial check

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);

    return () => observer.disconnect();
  }, [ref, direction]);

  return isOverflowing;
}
