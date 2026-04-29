"use client";

import { FaEdit } from "react-icons/fa";
import { ScrollToPointBtn } from "@/components/scroll/ScrollToPoint";
import UpdatePlayerIssuesAndFitness from "./IssuesUpdate";
import { GiHealthNormal, GiPresent } from "react-icons/gi";
import { RiDeleteBin2Line } from "react-icons/ri";
import PlayerProfileForm from "../new/NewSigningForms";
import { ConfirmActionButton } from "@/components/buttons/ConfirmAction";
import GalleryGrid from "@/components/Gallery/GallaryGrid";
import { GalleryUpload } from "@/components/Gallery/GalleryUpload";
import { IGallery } from "@/types/file.interface";
import { PrimaryCollapsible } from "@/components/Collapsible";
import { icons } from "@/assets/icons/icons";
import NotifierWrapper from "@/components/Notifier";
import PageLoader from "@/components/loaders/Page";
import { toast } from "sonner";
import { useGetGalleriesQuery } from "@/services/gallery.endpoints";
import {
  useGetPlayersQuery,
  useUpdatePlayerMutation,
  useDeletePlayerMutation,
  useGetPlayerQuery,
} from "@/services/player.endpoints";
import { buildQueryString } from "@/lib/searchParams";
import { IPlayer } from "@/types/player.interface";
import { useParams, useRouter } from "next/navigation";
import { H } from "@/components/Element";
import {Images}from 'lucide-react'

export default function PlayerProfilePage() {
  const router = useRouter();
  const playerSlug = useParams().playerSlug;

  const { data: playerData, isLoading: playerLoading } = useGetPlayerQuery(
    playerSlug?.toString() || "",
  );
  const { data: galleriesData } = useGetGalleriesQuery(
    `?tags=${playerData?.data?._id}`,
  );
  const { data: playersData } = useGetPlayersQuery(buildQueryString());

  const [updatePlayer] = useUpdatePlayerMutation();
  const [deletePlayer] = useDeletePlayerMutation();

  const player = playerData?.data;
  const galleries = galleriesData;
  const players = playersData;

  const handleUpdateStatus = async (status: boolean) => {
    try {
      const result = await updatePlayer({
        _id: player?._id,
        status: status ? "former" : "current",
      }).unwrap();
      if (result.success) {
        toast.success(result.message);
      }
    } catch (error) {
      toast.error("Failed to update player status");
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deletePlayer(player?._id || "").unwrap();
      if (result.success) {
        toast.success(result.message);
        router.push("/admin/players");
      }
    } catch (error) {
      toast.error("Failed to delete player");
    }
  };

  if (playerLoading) return <PageLoader />;
  if (!player && !playerLoading) return <div>Player not found</div>;

  const fullname = `${player?.lastName} ${player?.firstName}`;

  return (
    <main className="relative bg-cover py-8 ">
      <div
        className="h-screen w-full z-[-1] absolute inset-0 bottom-0 bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${
            player?.featureMedia?.[0]?.secure_url ?? player?.avatar
          })`,
        }}
      />

      <div className="bg-modalOverlay text-white w-full px-1 flex gap-2 overflow-x-auto sticky z-10 top-0 hidden__scrollbar">
        <ScrollToPointBtn
          sectionId="edit-player"
          className="flex gap-1 items-center shadow p-1 hover:text-primary transition-transform"
          label="Edit"
        >
          <FaEdit />
        </ScrollToPointBtn>

        <ScrollToPointBtn
          sectionId="fitness-update"
          className="flex gap-1 items-center shadow p-1 hover:text-primary transition-transform"
          label="Fitness"
        >
          <GiHealthNormal />
        </ScrollToPointBtn>

        <ScrollToPointBtn
          sectionId="gallery"
          className="flex gap-1 items-center shadow p-1 hover:text-primary transition-transform"
          label="Gallery"
        >
          <Images />
        </ScrollToPointBtn>

        <ScrollToPointBtn
          sectionId="danger-zone"
          className="flex gap-1 items-center shadow p-1 hover:text-primary transition-transform"
          label={player?.status ? "Active" : "Inactive"}
        >
          <GiPresent />
        </ScrollToPointBtn>

        <ScrollToPointBtn
          sectionId="danger-zone"
          className="flex gap-1 items-center shadow p-1 hover:text-primary transition-transform"
          label="Delete"
        >
          <RiDeleteBin2Line />
        </ScrollToPointBtn>
      </div>

      <main className="space-y-10 px-[2vw] pb-24 pt-7">
        {player?.status !== "current" && (
          <NotifierWrapper
            message="Unconfirmed player"
            className="text-Red"
            inDismissible
          >
            <p>{fullname} is not visible to the public</p>
          </NotifierWrapper>
        )}

        <h1 className="_heading backdrop-blur-xs p-0 flex items-center gap-6 justify-between flex-wrap">
          <span>{fullname}</span>
          <span className="text-muted-foreground">{player?.code}</span>
        </h1>

        <div className="my-3.5 space-y-2">
          <p>{player?.email}</p>
        </div>

        <UpdatePlayerIssuesAndFitness player={player as IPlayer} />

        <section id="edit-player">
          <PrimaryCollapsible
            header={{
              label: "Edit Player",
              icon: <icons.edit />,
              className: "ring",
            }}
          >
            <PlayerProfileForm player={player} />
          </PrimaryCollapsible>
        </section>

        <section id="galleries">
          <H>GALLERIES</H>
          <GalleryUpload
            tags={[fullname, player?._id].filter(Boolean) as string[]}
            players={players?.data}
          />
          <GalleryGrid galleries={galleries?.data as IGallery[]} />

          <br />
        </section>

        <section id="danger-zone">
          <h3 className="text-lg font-light mb-4 _label border-b pb-2">
            DANGER ZONE
          </h3>
          <div className="flex gap-10 max-sm:flex-col flex-wrap justify-center items-center bg-card py-6">
            {!player?.status && (
              <ConfirmActionButton
                onConfirm={() => handleUpdateStatus(true)}
                primaryText="CONFIRM PLAYER"
                loadingText="Approving..."
                confirmText={`Do you want to confirm ${fullname}?`}
                title="Confirm Player"
                variant="default"
              />
            )}
            <ConfirmActionButton
              onConfirm={() => handleUpdateStatus(false)}
              primaryText="DEACTIVATE PLAYER"
              loadingText="Deactivating..."
              confirmText={`Do you want to deactivate ${fullname}?`}
              variant="destructive"
              title="Deactivate Player"
            />
            <ConfirmActionButton
              onConfirm={handleDelete}
              primaryText="DELETE PLAYER"
              loadingText="Deleting..."
              confirmText={`Do you want to delete ${fullname}?`}
              variant="destructive"
              title="Delete Player"
              className="ring"
            />
          </div>
        </section>
      </main>
    </main>
  );
}
