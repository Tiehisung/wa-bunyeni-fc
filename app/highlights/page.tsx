"use client"

import InfiniteLimitScroller from "@/components/InfiniteScroll";
import { SearchHighlights } from "../admin/media/highlights/Search";
import { MatchHighlights } from "../admin/media/highlights/DisplayHighlights";

import { useGetHighlightsQuery } from "@/services/highlights.endpoints";
import { useGetMatchesQuery } from "@/services/match.endpoints";
import TableLoader from "@/components/loaders/Table";
import { useIsMobile } from "@/hooks/use-mobile";
import DataErrorAlert from "@/components/error/DataError";
import { H } from "@/components/Element";
import { useSearchParams } from "next/navigation";

export default function MatchHighlightsPage() {
  const searchParams = useSearchParams();
  const paramsString = searchParams.toString();

  const {
    data: highlights,
    isLoading: highlightsLoading,
    error: highlightsError,
  } = useGetHighlightsQuery(paramsString);

  const { data: matches, isLoading: matchesLoading } = useGetMatchesQuery({});

  const isLoading = highlightsLoading || matchesLoading;
  const ismobile = useIsMobile();
  if (isLoading) {
    return (
      <div className="min-h-96 pt-12 flex justify-center items-center">
        <TableLoader
          className="h-24 rounded-2xl"
          cols={ismobile ? 1 : 3}
          rows={ismobile ? 2 : 3}
        />
      </div>
    );
  }

  if (highlightsError) {
    return <DataErrorAlert message={highlightsError} />;
  }

  return (
    <div className=" min-h-96">
      <H>Match Highlights</H>
      <SearchHighlights matches={matches?.data} />
      <MatchHighlights highlights={highlights} />
      <InfiniteLimitScroller
        pagination={highlights?.pagination}
        endDataText="The End"
      />
    </div>
  );
}
