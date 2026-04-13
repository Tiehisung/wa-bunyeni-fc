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
import { useParams } from "next/navigation";

export default function PlayerProfilePage() {
  const playerSlug = useParams().playerSlug;

  const { data: playersData, isLoading: playersLoading } =
    useGetPlayersQuery("");

  const { data: galleriesData, isLoading: galleriesLoading } =
    useGetGalleriesQuery(`tags=${playerSlug}`);
  const {
    data: statsData,
    isLoading: statsLoading,
    error,
  } = useGetPlayerStatsQuery(playerSlug || "");

  const isLoading = playersLoading || galleriesLoading || statsLoading;
  const players = playersData;
  const galleries = galleriesData;
  const playerStats = statsData;

  const player = players?.data?.find((p) => p._id === playerSlug);



  return (
    <>
      <main className="pl-2">
        <PlayerProfile
           
          galleries={galleries?.data}
          stats={playerStats?.data}
        />
        <PlayerHeadList players={players?.data as IPlayer[]} />
      </main>
    </>
  );
}
