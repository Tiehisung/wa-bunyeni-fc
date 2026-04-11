"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

const ScrollToTop = () => {
  const pathname = usePathname();

  useLayoutEffect(() => {
    window.scrollTo({ behavior: "smooth", top: 0 });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
