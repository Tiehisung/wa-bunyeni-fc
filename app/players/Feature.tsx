"use client";

import PlayerFeatureStatsCard from "./PlayerStatsCard";
import { AnimateOnView } from "@/components/Animate/AnimateOnView";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import Loader from "@/components/loaders/Loader";
import DataErrorAlert from "@/components/error/DataError";

export function FeaturedPlayers() {
  const { data: playersData, isLoading, error } = useGetPlayersQuery("");
  const players = playersData;

  if (isLoading) {
    return <Loader message="Loading players..." />;
  }

  if (error || !players?.data?.length) {
    return <DataErrorAlert message={error} />;
  }

  // Filter only players with featureImage
  const featuredPlayers = players?.data?.filter(
    (pl) => pl?.featureMedia?.[0]?.secure_url,
  );

  if (!featuredPlayers.length) {
    return null;
  }

  return (
    <section className="_page flex flex-wrap gap-4 items-start justify-center">
      {featuredPlayers?.map((player, index) => {
        const name = `${player?.firstName} ${player?.lastName}`;
        return (
          <AnimateOnView index={index} key={player._id}>
            <PlayerFeatureStatsCard
              name={name}
              position={player.position}
              avatar={player.avatar}
              playerImage={
                player?.featureMedia?.[0]?.secure_url ?? player.avatar
              }
              goals={player.goals?.length}
              matches={player.matches?.length}
              assists={player.assists?.length}
              passAccuracy={player.passAcc?.length}
              trophies={player.trophies}
            />
          </AnimateOnView>
        );
      })}
    </section>
  );
}
