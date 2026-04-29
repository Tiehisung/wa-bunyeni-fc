"use client";

import PrimLink from "@/components/Link";
import { ResponsiveSwiper } from "@/components/carousel/ResponsiveSwiper";
import { Badge } from "@/components/ui/badge";
import { generatePlayerAbout } from "@/data/about";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import Loader from "@/components/loaders/Loader";
import { H } from "@/components/Element";
import DataErrorAlert from "@/components/error/DataError";
import Link from "next/link";
import Image from "next/image";

const LandingPlayers = () => {
  const { data: playersData, isLoading, error } = useGetPlayersQuery("");
  const players = playersData;

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <DataErrorAlert message={error} />;
  }

  return (
    <div id="players" className=" max-w-6xl mx-auto">
      <H>Players</H>
      <ResponsiveSwiper
        swiperStyles={{ width: "100%", height: "fit-content" }}
        slideStyles={{ borderRadius: "0" }}
        slides={
          players?.data?.map((player) => (
            <div key={player._id}>
              <Image
                src={player?.avatar}
                alt="player"
                width={500}
                height={500}
                className="min-w-full grow object-cover border aspect-video"
              />
              <div className="bg-secondary text-secondary-foreground space-y-2 p-4 pb-8">
                <Badge
                  className="capitalize min-h-6 min-w-10"
                  variant="secondary"
                >
                  {player?.position}
                </Badge>
                <div
                  className="_p line-clamp-4 mb-5 font-semibold"
                  dangerouslySetInnerHTML={{
                    __html: generatePlayerAbout(
                      player?.firstName || "",
                      player?.lastName || "",
                      player?.position,
                    ),
                  }}
                />

                <br />
                <Link href={`/players/details?playerId=${player?._id}`}>
                  <span className="bg-primary text-white p-2 px-4">
                    DISCOVER
                  </span>
                </Link>
              </div>
            </div>
          )) || []
        }
      />

      <PrimLink to="/players" text="See more" className="ml-auto" />
    </div>
  );
};

export default LandingPlayers;
