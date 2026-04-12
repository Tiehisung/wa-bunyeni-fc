"use client";

import { IPlayer } from "@/types/player.interface";
import PlayerProfile from "./Profile";
import { PlayerHeadList } from "./PlayerHeadList";

import { useGetGalleriesQuery } from "@/services/gallery.endpoints";
import {
  useGetPlayersQuery,
  useGetPlayerStatsQuery,
} from "@/services/player.endpoints";
import PageLoader from "@/components/loaders/Page";
import DataErrorAlert from "@/components/error/DataError";

import useGetParam from "@/hooks/params";

export default function PlayerProfilePage() {
  const playerId = useGetParam("playerId");

  const { data: playersData, isLoading: playersLoading } =
    useGetPlayersQuery("");
  const { data: galleriesData, isLoading: galleriesLoading } =
    useGetGalleriesQuery(`tags=${playerId}`);
  const {
    data: statsData,
    isLoading: statsLoading,
    error,
  } = useGetPlayerStatsQuery(playerId || "");

  const isLoading = playersLoading || galleriesLoading || statsLoading;
  const players = playersData;
  const galleries = galleriesData;
  const playerStats = statsData;

  const player = players?.data?.find((p) => p._id === playerId);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!player) {
    return <DataErrorAlert message={error} />;
  }

  return (
    <>
      <main className="pl-2">
        <PlayerProfile
          players={players?.data as IPlayer[]}
          galleries={galleries?.data}
          stats={playerStats?.data}
        />
        <PlayerHeadList players={players?.data as IPlayer[]} />
      </main>
    </>
  );
}
