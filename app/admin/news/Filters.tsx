"use client";

import { CHECKBOX } from "@/components/input/Checkbox";
import { useClearParams, useUpdateSearchParams } from "@/hooks/params";

export interface NewsFilterValues {
  isTrending?: boolean;
  isLatest?: boolean;
  isPublished?: boolean;
  from?: string;
  to?: string;
}

export default function NewsFilter() {
 
  const searchParams = new URLSearchParams(window.location.search);

  const isTrending = searchParams.get("isTrending");
  const isPublished = searchParams.get("isPublished");
  const isLatest = searchParams.get("isLatest");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const { setParam } = useUpdateSearchParams();
  const { clearOnly } = useClearParams();

  return (
    <div className="space-y-4 p-4 rounded-xl ">
      <h2 className="text-lg font-semibold">Filter News</h2>

      {/* Boolean Filters */}
      <div className="flex flex-wrap gap-4">
        <CHECKBOX
          label="Trending"
          checked={isTrending === "true"}
          onChange={(e) => setParam("isTrending", e.target.checked.toString())}
        />

        <CHECKBOX
          label="Latest"
          checked={isLatest === "true"}
          onChange={(e) => setParam("isLatest", e.target.checked.toString())}
        />

        <CHECKBOX
          label="Published"
          checked={isPublished === "true"}
          onChange={(e) =>
            setParam("isPublished", e.target.checked ? "true" : "")
          }
        />

        <CHECKBOX
          label="Unpublished"
          checked={isPublished === "false"}
          onChange={(e) =>
            setParam("isPublished", e.target.checked ? "false" : "")
          }
        />
      </div>

      {/* Date Filters */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">From Date</label>
          <input
            type="date"
            className="w-full border rounded-md px-2 py-1"
            value={from || ""}
            onChange={(e) => setParam("from", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">To Date</label>
          <input
            type="date"
            className="w-full border rounded-md px-2 py-1"
            value={to || ""}
            onChange={(e) => setParam("to", e.target.value)}
          />
        </div>
      </div>

      {/* Clear Button */}
      <button
        type="button"
        className="text-sm text-red-500 cursor-pointer _hover px-1"
        onClick={() =>
          clearOnly("isTrending", "isLatest", "isPublished", "from", "to")
        }
      >
        Reset Filters
      </button>
    </div>
  );
}
