import PlayerProfile from "./Profile";
import { PlayerHeadList } from "./PlayerHeadList";
import {   baseApiUrl } from "@/lib/configs";
import { IPlayer } from "@/types/player.interface";
import { IPageProps, IQueryResponse } from "@/types";
import { Metadata } from "next";
import { ENV } from "@/lib/env";
import { TEAM } from "@/data/team";

export const getPlayerById = async (slugOrId: string) => {
  try {
    const response = await fetch(`${baseApiUrl}/players/${slugOrId}`, {
      cache: "no-store",
    });

    if (!response.ok) return null;
    const player = await response.json();
    return player;
  } catch {
    return null;
  }
};

export async function generateMetadata({
  params,
}: IPageProps): Promise<Metadata> {
  const slug = (await params).playerSlug as string;
  const playerData: IQueryResponse<IPlayer> = await getPlayerById(slug);

  const player = playerData?.data;

  if (!player) {
    return {
      title: `Player | ${TEAM.name}`,
      description: "Latest updates from player at " + TEAM.name,
    };
  }

  const title = `${TEAM.name} - ${player?.firstName} ${player?.lastName} `;
    const description =
      player?.about ||
      player?.description ||
      `Player profile for ${player?.firstName} ${player?.lastName}`;


  const image = player?.avatar;
  const url = `${ENV.API_URL}/players/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: TEAM.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: player?.lastName,
        },
        ...(player?.featureMedia?.map((m) => ({
          url: m.secure_url,
          width: 1200,
          height: 630,
          alt: player?.firstName,
        })) || []),
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
export default async function PlayerProfilePage({ params }: IPageProps) {
  const playerSlug = (await params).playerSlug;
  const player: IQueryResponse<IPlayer> = await getPlayerById(
    playerSlug as string,
  );

  console.log(player?.data?.firstName);

  return (
    <>
      <main className="pl-2">
        <PlayerProfile />
        <PlayerHeadList />
      </main>
    </>
  );
}
