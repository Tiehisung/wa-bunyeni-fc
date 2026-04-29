// hooks/useInfiniteLimitParams.ts
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import type { IPagination } from "@/types";

export function useInfiniteLimitParams(pagination?: IPagination) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const updateLimitParam = useCallback(
    (newLimit: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("limit", String(newLimit));
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  useEffect(() => {
    if (!pagination) return;

    // Stop if we already fetched all items
    if (pagination.limit >= pagination.total) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const increasedLimit = pagination.limit + pagination.limit;
          // Double the limit each time (or pick your preferred strategy)

          const newLimit = Math.min(increasedLimit, pagination.total); // never exceed total

          updateLimitParam(newLimit);
        }
      },
      { rootMargin: "200px" },
    );

    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => {
      if (bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, [pagination, updateLimitParam]);

  return bottomRef;
}
