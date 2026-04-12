"use client";

import FilterPlayers from "./FilterPlayers";
import { IPlayer } from "@/types/player.interface";
import CaptaincyAdm from "./captaincy/Captaincy";
import { PrimarySearch } from "@/components/Search";
import { DisplayAdminPlayers } from "./DisplayPlayers";
 

import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import { useSearchParams } from "next/navigation";

export default function AdminPlayers() {
  const searchParams= useSearchParams();
  const paramsString = searchParams.toString();

  const {
    data: playersData,
    isLoading: playersLoading,
    error: playersError,
  } = useGetPlayersQuery(paramsString);

  const isLoading = playersLoading;
  const players = playersData;

  if (isLoading) {
    return (
      <div className="py-12 px-2.5 md:px-6 space-y-8 _page">
        <div className="flex justify-center items-center min-h-100">
          <Loader message="Loading players..." />
        </div>
      </div>
    );
  }

  if (playersError) {
    return (
      <div className="py-12 px-2.5 md:px-6 space-y-8 _page">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load players:{" "}
            {(playersError as any)?.message || "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="py-12 px-2.5 md:px-6 space-y-8 _page">
      <header className="mb-6 mx-auto">
        <div className="text-center mb-10 space-y-3.5">
          <h1 className="text-3xl font-bold">KFC PLAYERS</h1>
        </div>

        <div className="mt-4 mb-2 flex flex-wrap items-center justify-center gap-6">
          <FilterPlayers />
          <PrimarySearch
            className="py-1 max-w-[80vw] grow"
            placeholder="Search Player"
            type="search"
            name="search"
            searchKey="player_search"
          />
        </div>
      </header>

      <hr className="border-red-500" />

      <section className="min-h-screen md:p-6 rounded-2xl">
        <DisplayAdminPlayers players={players} />
      </section>

      <section className="mt-12">
        <CaptaincyAdm players={players?.data as IPlayer[]} />
      </section>
    </div>
  );
}
