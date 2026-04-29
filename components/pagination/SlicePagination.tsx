'use client'
import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps<T> {
  data?: T[];
  onPageChange?: (pageData: T[], page: number) => void;
  isMinimal?: boolean;
  itemsPerPage?: number;
  pageSizes?: number[]; // optional custom sizes
  hideLimit?: boolean;
  search?: string;
}

export function SlicePagination<T>({
  data = [],
  onPageChange,
  isMinimal,
  itemsPerPage = 3,
  pageSizes = [3, 5, 10, 20],
  hideLimit,
  search,
}: PaginationProps<T>) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(itemsPerPage);

  const totalPages = Math.ceil(data.length / limit);

  useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    const sliced = data.slice(start, end);
   onPageChange?.(sliced, page);
  }, [page, data, limit]);

  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setPage(1); // reset to page 1 when view size changes
  };

  //Reset Page to 1 on search change
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Selector */}
      {!hideLimit && (
        <div className="flex items-center gap-1">
          <span className="text-sm opacity-80">Limit:</span>
          <select
            value={limit}
            onChange={handleLimitChange}
            className="border rounded px-2 py-1 text-sm bg-background outline-primary"
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-1">
        <button
          type="button"
          onClick={handlePrev}
          disabled={page === 1}
          className={`rounded-md border disabled:opacity-40 flex items-center gap-2 ${
            isMinimal ? "p-1.5" : "px-3 py-2"
          }`}
        >
          <ChevronLeft size={18} />
          {!isMinimal && "Prev"}
        </button>

        <span className="text-sm font-medium">
          {!isMinimal && "Page"} {page} of {totalPages}
        </span>

        <button
          type="button"
          onClick={handleNext}
          disabled={page === totalPages}
          className={`rounded-md border disabled:opacity-40 flex items-center gap-2 ${
            isMinimal ? "p-1.5" : "px-3 py-2"
          }`}
        >
          {!isMinimal && "Next"}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
