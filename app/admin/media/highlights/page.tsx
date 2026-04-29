"use client";

import { HighlightUpload } from "./Uploader";
import { MatchHighlights } from "./DisplayHighlights";
import { SearchHighlights } from "./Search";
import InfiniteLimitScroller from "@/components/InfiniteScroll";
import { useGetHighlightsQuery } from "@/services/highlights.endpoints";
 import { useGetMatchesQuery } from "@/services/match.endpoints";
import { OverlayLoader } from "@/components/loaders/OverlayLoader";
import DataErrorAlert from "@/components/error/DataError";
import TableLoader from "@/components/loaders/Table";
import { useSearchParams } from "next/navigation";

export default function MatchHighlightsPage() {
  const  searchParams  = useSearchParams();
  const queryString = searchParams.toString()
    ? `?${searchParams.toString()}`
    : "";

  // Fetch highlights with query params
  const {
    data: highlights,
    isLoading: highlightsLoading,
    error: highlightsError,
    isFetching: highlightsFetching,
  } = useGetHighlightsQuery(queryString);

  // Fetch matches for the uploader and search
  const { data: matches, isLoading: matchesLoading } = useGetMatchesQuery({});

  const isLoading = highlightsLoading || matchesLoading;
  if (isLoading) {
    return <TableLoader className="h-32" rows={2} cols={2} />;
  }

  if (highlightsError) return <DataErrorAlert message={highlightsError} />;

  return (
    <div className="pt-5 min-h-96">
      <HighlightUpload matches={matches?.data} />

      <SearchHighlights matches={matches?.data} />

      <MatchHighlights highlights={highlights} />

      <InfiniteLimitScroller
        pagination={highlights?.pagination}
        endDataText="The End"
      />

      <OverlayLoader isLoading={highlightsFetching} />
    </div>
  );
}
