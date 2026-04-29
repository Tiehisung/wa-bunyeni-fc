"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IPlayer } from "@/types/player.interface";
import { getInitials } from "@/lib";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetPlayersQuery } from "@/services/player.endpoints";

export function PlayerHeadList(  ) {
  const { playerSlug } = useParams();

  const { data: playersData, isLoading } = useGetPlayersQuery("");

  const otherPlayers = playersData?.data?.filter((p) => p?.slug !== playerSlug);

  if (!playersData && !isLoading) {
    return null;
  }

  return (
    <div className="fixed top-20 -left-2 z-10 flex items-center gap-4 flex-col border rounded-full p-1 bg-secondary/20 backdrop:blur-xs shadow-md max-h-[45vh] w-fit overflow-y-auto _hideScrollbar">
      {otherPlayers?.map((player) => {
        const isSelected = playerSlug === player?.slug;

        return (
          <Link
            href={`/players/${player?.slug}`}
            key={player?._id}
            title={`${player?.lastName?.[0]}. ${player?.firstName}`}
            className={
              isSelected
                ? "ring-4 ring-primaryGreen rounded-full after:w-1 after:h-1 after:bg-primaryGreen after:rounded-full"
                : ""
            }
          >
            <Avatar className="hover:opacity-90 _slowTrans">
              <AvatarImage src={player?.avatar} alt={player?.lastName} />
              <AvatarFallback>
                {getInitials([player?.lastName, player?.firstName])}
              </AvatarFallback>
            </Avatar>
          </Link>
        );
      })}
    </div>
  );
}
