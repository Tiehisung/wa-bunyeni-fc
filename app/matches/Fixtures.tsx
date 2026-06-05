"use client";

import { SearchQueryUpdator } from "./Headers";
import { IQueryResponse } from "@/types";
import { MotionWrapper } from "@/components/Animate/MotionWrapper";
import { MatchFixtureCard } from "./MatchCard";
// import InfiniteLimitScroller from "@/components/InfiniteScroll";
import { IMatch } from "@/types/match.interface";
import { useGetMatchesQuery } from "@/services/match.endpoints";
import TableLoader from "@/components/loaders/Table";
import HEADER from "@/components/Element";
import DataErrorAlert from "@/components/error/DataError";
import { getErrorMessage } from "@/lib/error";
import { Pagination } from "@/components/pagination/Pagination";
import { buildQueryObject } from "@/lib/searchParams";
import { PrimarySearch } from "@/components/Search";

interface IProps {
  fixtures?: IQueryResponse<IMatch[]>;
}

const FixturesSection = ({}: IProps) => {
  const filters = buildQueryObject();
  console.log(filters);

  const {
    data: fixtures,
    isLoading,
    error,
  } = useGetMatchesQuery({ ...filters });

  console.log(fixtures)
  const filtersOptions = [
    { label: "All", value: "" },
    { label: "Home", value: "home" },
    { label: "Away", value: "away" },
  ];

  if (isLoading) {
    return <TableLoader size="xl" className="rounded-xl" />;
  }

  if (error) {
    return (
      <div>
        <HEADER title="Scores & Fixtures" />
        <DataErrorAlert message={getErrorMessage(error)} />
      </div>
    );
  }
  if (!fixtures) return <div className="_label">No fixtures</div>;
  return (
    <div id="fixtures" className="">
      <header className="flex justify-between items-center gap-4 mb-6">
        <PrimarySearch searchKey="match_search" />

        <SearchQueryUpdator query="fixture" options={filtersOptions} />
      </header>

      <main className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-3">
        {fixtures?.data?.map((f, index) => (
          <MotionWrapper
            hoverEffect={false}
            direction="right"
            key={f._id}
            index={index}
          >
            <MatchFixtureCard match={f} />
          </MotionWrapper>
        ))}
      </main>
      {/* <InfiniteLimitScroller
        pagination={fixtures?.pagination}
        endDataText="No more matches"
      /> */}
      <Pagination pagination={fixtures?.pagination} />
    </div>
  );
};

export default FixturesSection;
