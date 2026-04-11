"use client";

import { PlayerGalleriesClient } from "./Galleries";
import HEADER from "@/components/Element";
 
import Loader from "@/components/loaders/Loader";
import { useGetGalleriesQuery } from "@/services/gallery.endpoints";
import { useGetPlayerQuery } from "@/services/player.endpoints";
import { useAppSelector } from "@/store/hooks/store";
import DataErrorAlert from "@/components/error/DataError";
import useGetParam from "@/hooks/params";

const PlayerGalleriesPage = () => {
  const { user } = useAppSelector((s) => s.auth);
 
  const playerId = useGetParam("playerId");

  const { data: playerData, isLoading: playerLoading } = useGetPlayerQuery(
    user?.email || "",
  );

  const tags = [playerId as string, user?.name].filter(Boolean).join(",");
  const queryString = `tags=${tags}`;

  console.log(queryString);

  const {
    data: galleriesData,
    isLoading: galleriesLoading,
    error,
    refetch,
    isFetching,
  } = useGetGalleriesQuery("queryString");

  const isLoading = playerLoading || galleriesLoading;
  const player = playerData?.data;
  const galleries = galleriesData;

  if (isLoading) {
    return (
      <div className="">
        <HEADER title="My Galleries" subtitle="Manage your own galleries" />
        <div className="flex justify-center items-center min-h-100">
          <Loader message="Loading galleries..." />
        </div>
      </div>
    );
  }

  if (!player || !galleries) {
    return (
      <div className="_page">
        <HEADER title="My Galleries" subtitle="Manage your own galleries" />

        <DataErrorAlert
          message={error}
          onRefetch={refetch}
          isRefreshing={isFetching}
        />
      </div>
    );
  }

  return (
    <div className="">
      <HEADER title="My Galleries" subtitle="Manage your own galleries" />
      <PlayerGalleriesClient player={player} galleries={galleries} />
    </div>
  );
};

export default PlayerGalleriesPage;
