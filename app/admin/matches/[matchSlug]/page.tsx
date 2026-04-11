"use client";

import { IMatch, ITeam } from "@/types/match.interface";
import { checkTeams, checkMatchMetrics } from "@/lib/compute/match";
import { MatchEventsAdmin } from "../live-match/EventsUpdator";
import MatchActions from "./Actions";
import { Badge } from "@/components/ui/badge";
 
import { useGetMatchQuery } from "@/services/match.endpoints";
import { AVATAR } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import PageLoader from "@/components/loaders/Page";
import DataErrorAlert from "@/components/error/DataError";
import { getErrorMessage } from "@/lib/error";
import { formatDate } from "@/lib/timeAndDate";
import MatchFliers from "./Fliers";
import { useParams } from "next/navigation";

export default function MatchPage() {
  const slug = useParams().matchSlug;

  const { data: matchData, isLoading, error } = useGetMatchQuery(slug?.toString() || "");

  const match = matchData?.data;

  const { home, away } = checkTeams(match);

  const matchMetrics = checkMatchMetrics(match);
  const isMobile = useIsMobile();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return <DataErrorAlert message={getErrorMessage(error)} />;
  }

  return (
    <div className="container mx-auto p-4 _page">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-primaryRed">
          {match?.title} <Badge className="ml-auto">{match?.status}</Badge>
        </h1>
        <p className="text-muted-foreground">{formatDate(match?.date)}</p>
      </header>

      <MatchActions match={match} />
      <MatchFliers match={match} />
      <div className="my-6 flex items-center justify-between gap-6 border p-3 bg-secondary">
        <section className="flex flex-col justify-center items-center gap-2.5 pointer-events-none">
          <AVATAR
            src={home?.logo as string}
            alt={home?.name}
            size={isMobile ? "lg" : "2xl"}
          />
          <p className="text-lg md:text-xl font-semibold ">{home?.name}</p>
        </section>

        <section className="flex flex-col justify-center items-center">
          {match?.status === "UPCOMING" ? (
            <div className="font-semibold text-2xl">VS</div>
          ) : (
            <div className="mx-auto text-2xl text-center">
              {matchMetrics?.goals?.home ?? 0} -{matchMetrics?.goals?.away ?? 0}
            </div>
          )}
        </section>

        <section className="flex flex-col justify-center items-center gap-2.5">
          <AVATAR
            src={away?.logo as string}
            alt={away?.name}
            size={isMobile ? "lg" : "2xl"}
            shape="rounded"
          />
          <p className="text-lg md:text-xl font-semibold ">{away?.name} </p>
        </section>
      </div>

      <br />

      {match && (
        <MatchEventsAdmin
          opponent={match?.opponent as ITeam}
          match={match as IMatch}
        />
      )}
    </div>
  );
}
