"use client";

import { IPlayer } from "@/types/player.interface";
import PlayerProfile from "./Profile";
import { PlayerHeadList } from "./PlayerHeadList";

import { useGetGalleriesQuery } from "@/services/gallery.endpoints";
import {
  useGetPlayersQuery,
  useGetPlayerStatsQuery,
} from "@/services/player.endpoints";

import { useParams } from "next/navigation";

export default function PlayerProfilePage() {
  const playerSlug = useParams().playerSlug;

  const { data: playersData } = useGetPlayersQuery("");

  const { data: galleriesData } = useGetGalleriesQuery(`tags=${playerSlug}`);
  const { data: statsData } = useGetPlayerStatsQuery(
    playerSlug?.toString() || "",
  );

  const players = playersData;
  const galleries = galleriesData;
  const playerStats = statsData;

  return (
    <>
      <main className="pl-2">
        <PlayerProfile galleries={galleries?.data} stats={playerStats?.data} />
        <PlayerHeadList players={players?.data as IPlayer[]} />
      </main>
    </>
  );
}
