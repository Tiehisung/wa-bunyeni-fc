"use client";

 import React, { useEffect, useRef, useCallback } from "react";
import type { IPagination } from "@/types";
import Loader from "./loaders/Loader";
import { useRouter } from "next/navigation";

interface InfiniteLimitScrollerProps {
  pagination?: IPagination;
  className?: string;
  increaseBy?: number;
  endDataText?: string;
  loader?: React.ReactNode;
}

/**
 * A complete infinite-scroll component that increases LIMIT
 * and updates searchParams to trigger more data fetching.
 */
export default function InfiniteLimitScroller({
  pagination,
  className = "",
  increaseBy = 10,
  loader,
  endDataText,
}: InfiniteLimitScrollerProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
 

  // Update limit in URL params
  const updateLimitParam = useCallback(
    (newLimit: number) => {
      const params = new URLSearchParams(location.search);
      params.set("limit", String(newLimit));

      router.replace(`?${params.toString()}`, );
    },
    [router, window.location.search],
  );

  useEffect(() => {
    if (!pagination) return;

    const { limit, total } = pagination;

    // Stop loading more
    if (limit >= total) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const increasedLimit = limit + increaseBy;
          const newLimit = increasedLimit > total ? total : increasedLimit;
          updateLimitParam(newLimit);
        }
      },
      { rootMargin: "200px" },
    );

    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => {
      if (bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, [pagination, updateLimitParam, increaseBy]);

  return (
    <div className={className}>
      {/* infinite scroll trigger */}
      {Number(pagination?.limit) < Number(pagination?.total) && (
        <div
          ref={bottomRef}
          className="col-span-full py-6 text-center text-gray-400"
        >
          {loader ?? <Loader message="Loading more…" />}
        </div>
      )}

      {/* end of data */}
      {Number(pagination?.limit) >= Number(pagination?.total) && (
        <p className="col-span-full py-6 text-center text-gray-500">
          {endDataText ?? `You've reached the end 🎉`}
        </p>
      )}
    </div>
  );
}
