 

import { useState, useEffect, SetStateAction } from "react";

export function useGetViewportWidth() {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    if (typeof window == "undefined") return;

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    const interval = setInterval(() => {
      localStorage.setItem("viewport-width", JSON.stringify(window.innerWidth));
    }, 3000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  return width;
}

export function useSetViewportWidth({
  setViewWidth,
}: {
  setViewWidth?: React.Dispatch<SetStateAction<number>>;
}) {
  useEffect(() => {
    if (typeof window == "undefined") return;

    const handleResize = () => {
      if (setViewWidth) {
        setViewWidth(window.innerWidth);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
}

/**
 * Custom hook that returns the current viewport height.
 *
 * This hook sets up an event listener for the window's scroll event
 * and updates the viewport height state whenever the window is scrolled.
 *
 * @returns {number} The current height of the viewport.
 */
export function useGetScrollHeight(): number {
  const [viewheight, setViewHeight] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => setViewHeight(window.innerHeight);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return viewheight;
}
