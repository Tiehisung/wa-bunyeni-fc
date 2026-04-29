"use client";

import { useEffect, useState } from "react";

/**
 * React hook that returns a random index from an array at intervals.
 * @param arr - The array to pick from
 * @param interval - Time in ms between picks
 * @returns The current random index
 */
export function useRandomItemInterval<T>(arr: T[], interval = 3000) {
  const [index, setIndex] = useState<number>(() =>
    arr.length ? Math.floor(Math.random() * arr.length) : -1
  );

  useEffect(() => {
    if (!arr.length) return;
    const timer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * arr.length);
      setIndex(randomIndex);
    }, interval);

    return () => clearInterval(timer);
  }, [arr, interval]);

  return { index, item: arr[index] };
}
