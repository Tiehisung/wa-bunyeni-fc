"use client";

import HEADER from "@/components/Element";
import OurPlayers from "./Display";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import Loader from "@/components/loaders/Loader";
 
import DataErrorAlert from "@/components/error/DataError";

const PlayersPage = () => {
  const { data: playersData, isLoading, error } = useGetPlayersQuery("");
  const players = playersData;

  if (isLoading) {
    return (
      <div className="">
        <HEADER title="Players" subtitle="Meet Our Gallant Players" />
        <div className="flex justify-center items-center min-h-100">
          <Loader message="Loading players..." />
        </div>
      </div>
    );
  }

  if (error) {
    return <DataErrorAlert message={error} />;
  }

  return (
    <>
     

      <div className=" px-[]">
        <HEADER title="Players" subtitle="Meet Our Gallant Players" />
        <OurPlayers players={players} />
      </div>
    </>
  );
};

export default PlayersPage;
 