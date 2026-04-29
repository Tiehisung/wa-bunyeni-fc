"use client";

import { Button } from "../buttons/Button";
import { useUpdateSearchParams } from "@/hooks/params";
import { FC } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { IPagination } from "@/types";

export const _pagination: IPagination = {
  page: 1,
  total: 10,
  pages: 3,
  hasNextPage: true,
  hasPreviousPage: true,
  limit: 0,
  nextPage: 0,
  previousPage: 0,
};

interface PaginationProps {
  pagination?: IPagination;
  className?: string;
  buttonStyles?: string;
  useAngles?: boolean;
  useMiniDisplay?: boolean;
  enumPages?: boolean;
  bordered?: boolean;
}

export const Pagination: FC<PaginationProps> = ({
  pagination,
  className = "",
  buttonStyles = "",
  useAngles,
  useMiniDisplay,
}) => {
  const { setParam } = useUpdateSearchParams();

  const handlePrevious = () => {
    if ((pagination?.page ?? 0) > 1) {
      setParam("page", (Number(pagination?.page ?? 2) - 1).toString());
    }
  };

  const handleNext = () => {
    if (Number(pagination?.page) < Number(pagination?.pages)) {
      setParam("page", (Number(pagination?.page ?? 0) + 1).toString());
    }
  };

  const miniDisplayClass = useMiniDisplay
    ? "flex-row-reverse justify-start py-4 mt-1.5 max-w-44 ml-auto"
    : "";

  if (!pagination || !pagination?.total || !pagination.page) return null;

  return (
    <div
      className={`flex justify-between items-center w-full gap-4 px-4 py-2 ${miniDisplayClass} ${className}`}
    >
      <div>
        {useMiniDisplay ? (
          <span className="text-xs font-semibold opacity-70 whitespace-nowrap">
            {(pagination.page - 1) * pagination.limit + 1}
            {" - "}
            {Math.min(pagination.page * pagination.limit, pagination.total)}
            {" of "} {pagination.total}
          </span>
        ) : (
          <small>
            Page {pagination.page} of {pagination.pages}
          </small>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          aria-label="Go to previous page"
          disabled={pagination.page < 2}
          className={` border px-2 py-1 text-sm ${buttonStyles}`}
          onClick={handlePrevious}
          variant={"secondary"}
        >
          {useAngles ? <FaAngleLeft className="" /> : "Prev"}
        </Button>

        <Button
          aria-label="Go to next page"
          disabled={pagination.page === pagination.pages}
          className={` border px-2 py-1 text-sm ${buttonStyles}`}
          onClick={handleNext}
          variant={"secondary"}
        >
          {useAngles ? <FaAngleRight /> : "Next"}
        </Button>
      </div>
    </div>
  );
};
