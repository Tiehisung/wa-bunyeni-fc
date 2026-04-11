"use client";

import { MatchEventsAdmin } from "./EventsUpdator";
import { StartStopMatch } from "./StartStop";
import { IMatch, ITeam } from "@/types/match.interface";
import { checkTeams, checkMatchMetrics } from "@/lib/compute/match";
import HEADER from "@/components/Element";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import { useGetLiveMatchQuery } from "@/services/match.endpoints";

export default function LiveMatchPage() {
  const {
    data: matchData,
    isLoading: matchLoading,
    error: matchError,
  } = useGetLiveMatchQuery({});

  const { data: playersData, isLoading: playersLoading } =
    useGetPlayersQuery("");

  const isLoading = matchLoading || playersLoading;
  const match = matchData;
  const players = playersData;

  if (isLoading) {
    return (
      <div className="_page flex justify-center items-center min-h-100">
        <Loader message="Loading live match..." />
      </div>
    );
  }

  if (matchError) {
    return (
      <div className="_page p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load live match:{" "}
            {(matchError as any)?.message || "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { home, away } = checkTeams(match?.data as IMatch);
  const matchMetrics = checkMatchMetrics(match?.data as IMatch);

  if (!match?.data) {
    return (
      <div className="_label _card rounded-2xl text-center my-14 mx-6 _page">
        No Live Match Yet. You need to start a match first.
      </div>
    );
  }

  if (match?.data.status === "FT") {
    return (
      <div className="_page p-4">
        <h1 className="text-2xl font-bold mb-4 text-primaryRed">
          Played today
        </h1>
        <div className="my-6 _card rounded-tl-3xl rounded-br-3xl flex items-center justify-between gap-6">
          <img
            src={home?.logo as string}
            alt={home?.name ?? ""}
            className="aspect-square h-16 w-16 sm:h-24 sm:w-24 object-cover"
          />
          <div className="flex flex-col justify-center items-center">
            <div className="text-xl md:text-2xl font-black uppercase">
              {home?.name}
            </div>
            <div className="mx-auto text-2xl text-center">
              {matchMetrics?.goals?.home ?? 0} -{" "}
              {matchMetrics?.goals?.away ?? 0}
            </div>
            <div className="text-xl md:text-2xl font-black uppercase">
              {away?.name}
            </div>
          </div>
          <img
            src={away?.logo as string}
            alt={away?.name ?? ""}
            className="aspect-square h-16 w-16 sm:h-24 sm:w-24 object-cover"
          />
        </div>
      </div>
    );
  }

  if (match?.data.status === "UPCOMING") {
    return (
      <div className="_page p-4">
        <div className="font-bold mb-4 text-primaryRed">
          <HEADER title="DUE TODAY" subtitle="Update all events live" />
        </div>
        {match?.data?.squad ? (
          <div className="my-6 _card rounded-tl-3xl rounded-br-3xl flex items-center justify-between gap-6">
            <img
              src={home?.logo as string}
              alt={home?.name ?? ""}
              className="aspect-square h-16 w-16 sm:h-24 sm:w-24 object-cover"
            />
            <div className="flex justify-center items-center">
              <div className="text-xl md:text-2xl font-black uppercase">
                {home?.name}
              </div>
              <div className="mx-auto text-2xl text-center px-3">VS</div>
              <div className="text-xl md:text-2xl font-black uppercase">
                {away?.name}
              </div>
            </div>
            <img
              src={away?.logo as string}
              alt={away?.name ?? ""}
              className="aspect-square h-16 w-16 sm:h-24 sm:w-24 object-cover"
            />
          </div>
        ) : (
          <p className="_label p-6">No Squad Yet!</p>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 _page">
      <h1 className="text-2xl font-bold mb-4 text-primaryRed">
        Live Match Update
      </h1>
      <div className="my-6 _card rounded-tl-3xl rounded-br-3xl flex items-center justify-between gap-6">
        <img
          src={home?.logo as string}
          alt={home?.name ?? ""}
          className="aspect-square h-16 w-16 sm:h-24 sm:w-24 object-cover"
        />
        <div className="flex flex-col justify-center items-center">
          <div className="text-xl md:text-2xl font-black uppercase">
            {home?.name}
          </div>
          <div className="mx-auto text-2xl text-center">
            {matchMetrics?.goals?.home ?? 0} - {matchMetrics?.goals?.away ?? 0}
          </div>
          <div className="text-xl md:text-2xl font-black uppercase">
            {away?.name}
          </div>
        </div>
        <img
          src={away?.logo as string}
          alt={away?.name ?? ""}
          className="aspect-square h-16 w-16 sm:h-24 sm:w-24 object-cover"
        />
      </div>

      <StartStopMatch match={match?.data} players={players?.data} />
      <br />

      {match?.data?.status === "LIVE" && match?.data?.squad && (
        <MatchEventsAdmin
          opponent={match?.data?.opponent as ITeam}
          match={match?.data as IMatch}
        />
      )}
    </div>
  );
}
