"use client";

import { EPlayerAgeCategory, IPlayer } from "@/types/player.interface";
import CaptaincyAdm from "./captaincy/Captaincy";
import { PrimarySearch } from "@/components/Search";
import { DisplayAdminPlayers } from "./DisplayPlayers";
import Loader from "@/components/loaders/Loader";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import { useRouter, useSearchParams } from "next/navigation";
import DataErrorAlert from "@/components/error/DataError";
import { H } from "@/components/Element";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import Link from "next/link";
import { sParamsToObject } from "@/lib/searchParams";
import { Button } from "@/components/buttons/Button";
import { PrintPlayersBtn } from "./Export";
import SELECT, { PrimarySelect } from "@/components/select/Select";
import { enumToOptions } from "@/lib/select";

export default function AdminPlayers() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    data: playersData,
    isLoading: playersLoading,
    error: playersError,
  } = useGetPlayersQuery(sParamsToObject(searchParams));

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

        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
          <Button
            onClick={() => router.push("/admin/players/new")}
            className="flex items-center gap-2 border hover:ring rounded px-2 py-1 w-max mt-4"
          >
            Add Player
            <Plus />
          </Button>
          <PrintPlayersBtn />
        </div>

        <div className="mt-4 mb-2 flex flex-wrap items-center justify-center gap-6">
          <PrimarySearch
            className=" max-w-[80vw] grow"
            placeholder="Search Player"
            type="search"
            name="search"
            searchKey="player_search"
          />
          <PrimarySelect
            options={enumToOptions(EPlayerAgeCategory)}
            paramKey="category"
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
