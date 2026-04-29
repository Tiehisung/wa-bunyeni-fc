"use client";

import { useEffect } from "react";

export const useActionOnEsc = ({ onEscape }: { onEscape: () => void }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscape();
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return null;
};

export function fireEscape(target: HTMLElement | Document = document) {
  target.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Escape",
      code: "Escape",
      bubbles: true,
    }),
  );
}

export function fireDoubleEscape(time: number = 400) {
  fireEscape();
  setTimeout(() => {
    fireEscape();
  }, time);
}
