// hooks/useInfiniteLimitParams.ts
import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef } from "react";
import type { IPagination } from "@/types";

export function useInfiniteLimitParams(pagination?: IPagination) {
  const navigate = useNavigate();
  const location = useLocation();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const updateLimitParam = useCallback(
    (newLimit: number) => {
      const params = new URLSearchParams(location.search);
      params.set("limit", String(newLimit));
      navigate(`?${params.toString()}`, { replace: true });
    },
    [navigate, location.search],
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
