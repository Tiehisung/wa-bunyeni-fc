"use client";

import SquadForm from "./SquadForm";
import SquadCard from "./SquadCard";
import { formatDate } from "@/lib/timeAndDate";
import { PrimarySearch } from "@/components/Search";
import HEADER from "@/components/Element";
import { PrimaryTabs } from "@/components/Tabs";
import { EMatchStatus } from "@/types/match.interface";

import Loader from "@/components/loaders/Loader";
import { PrimaryAccordion } from "@/components/ui/accordion";
import { useGetMatchesQuery } from "@/services/match.endpoints";
import useGetParam from "@/hooks/params";

const SquadPage = () => {
  const targetMatchId = useGetParam("matchId");

  const { data: matchesData, isLoading } = useGetMatchesQuery({
    status: EMatchStatus.UPCOMING,
  });

  const matches = matchesData;

  const targetMatch = matches?.data?.find((m) => m._id === targetMatchId);

  const accordion = matches?.data?.map((match) => ({
    trigger: (
      <div className="flex items-center gap-4 justify-between">
        <div>
          <p>{match?.title}</p>
          <p className="font-light italic">{match?.isHome ? "HOME" : "AWAY"}</p>
        </div>
        <div className="text-sm font-light">
          <p>{formatDate(match?.date, "March 2, 2025")}</p>
          <p className="italic">{match?.time}</p>
        </div>
      </div>
    ),
    content: <SquadCard match={match} />,
    value: match?._id ?? "",
  }));

  if (isLoading) {
    return (
      <div className="px-4">
        <HEADER title="SQUAD" />
        <Loader message="Loading squads..." />
      </div>
    )
  }

  return (
    <div className="">
      <HEADER title="SQUAD" />
      <main className="_page px-3 mt-6">
        <PrimaryTabs
          tabs={[
            { label: "All Squads", value: "all-squads" },
            { label: "New Squad", value: "new-squad" },
          ]}
          defaultValue="new-squad"
          className=""
        >
          <section className="mt-12 space-y-6">
            <PrimarySearch
              inputStyles="h-9"
              placeholder="Search Squad"
              searchKey="squad_search"
            />
            <PrimaryAccordion
              data={accordion ?? []}
              className=""
              triggerStyles="cursor-pointer _card"
            />
          </section>
          <section>
            <SquadForm defaultMatch={targetMatch} />
          </section>
        </PrimaryTabs>
      </main>
    </div>
  );
};

export default SquadPage;
