import { SearchQueryUpdator } from "./Headers";
import { IQueryResponse } from "@/types";
import { MotionWrapper } from "@/components/Animate/MotionWrapper";
import { MatchFixtureCard } from "./MatchCard";
import InfiniteLimitScroller from "@/components/InfiniteScroll";
import { IMatch } from "@/types/match.interface";

interface IProps {
  fixtures?: IQueryResponse<IMatch[]>;
}

const FixturesSection = ({ fixtures }: IProps) => {
  const filters = [
    { label: "All", value: "" },
    { label: "Home", value: "home" },
    { label: "Away", value: "away" },
  ];

  if (!fixtures) return <div className="_label">No fixtures</div>;
  return (
    <section id="fixtures" className="">
      <header className="flex justify-between items-center gap-4 mb-6">
        <SearchQueryUpdator query="fixture" options={filters} />

        <div className="p-2 flex items-center text-sm gap-1 text-muted-foreground py-4">
          <span>{fixtures?.pagination?.page}</span> of
          <span>{fixtures?.pagination?.pages}</span>{" "}
          <div className="ml-1">Total: {fixtures?.pagination?.total}</div>
        </div>
      </header>

      <br />

      <div>
        <section className="grid md:grid-cols-2 gap-y-3.5 gap-x-5">
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
        </section>

        <br />

        <section>
          <InfiniteLimitScroller
            pagination={fixtures?.pagination}
            endDataText="No more matches"
          />
        </section>
      </div>
    </section>
  );
};

export default FixturesSection;
