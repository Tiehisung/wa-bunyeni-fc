"use client";

import { IPlayer } from "@/types/player.interface";
import CaptaincyAdm from "./captaincy/Captaincy";
import { PrimarySearch } from "@/components/Search";
import { DisplayAdminPlayers } from "./DisplayPlayers";
import Loader from "@/components/loaders/Loader";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import { useSearchParams } from "next/navigation";
import DataErrorAlert from "@/components/error/DataError";
import { H } from "@/components/Element";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AdminPlayers() {
  const searchParams = useSearchParams();
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
      <div className="py-12 px-2.5 md:px-6 space-y-8 ">
        <div className="flex justify-center items-center min-h-100">
          <Loader message="Loading players..." />
        </div>
      </div>
    );
  }

  if (playersError) {
    return <DataErrorAlert message={playersError} />;
  }

  return (
    <div className="py-12 px-2.5 md:px-6 space-y-8 ">
      <header className="mb-6 mx-auto">
        <H>KFC PLAYERS</H>

        <Link
          href="/admin/players/new"
          className="flex items-center gap-2 border _borderColor hover:ring rounded px-2 py-1 w-max mt-4"
        >
          Add Player
          <Plus />
        </Link>

        <div className="mt-4 mb-2 flex flex-wrap items-center justify-center gap-6">
          <PrimarySearch
            className=" max-w-[80vw] grow"
            placeholder="Search Player"
            type="search"
            name="search"
            searchKey="player_search"
          />
        </div>
      </header>

      <Separator />

      <section className="min-h-screen rounded-2xl">
        <DisplayAdminPlayers players={players} />
      </section>

      <section className="mt-12">
        <CaptaincyAdm players={players?.data as IPlayer[]} />
      </section>
    </div>
  );
}
