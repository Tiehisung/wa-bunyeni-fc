import { TEAM } from "@/data/team";
import { ENV } from "@/lib/env";
import { IPageProps, IQueryResponse } from "@/types";
import { IPlayer } from "@/types/player.interface";
import { getPlayer } from "../[slug]/page";
import { Metadata } from "next";
import PlayerProfile from "./Profile";

export async function generateMetadata({
  params,
}: IPageProps): Promise<Metadata> {
  const slug = (await params).slug as string;
  const playerData: IQueryResponse<IPlayer> = await getPlayer(slug);

  const player = playerData?.data;

  if (!player) {
    return {
      title: `Player | ${TEAM.name}`,
      description: `Latest updates from player at ${TEAM.name}`,
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
const PlayerDashboardPage = () => {
  return (
    <div>
      <PlayerProfile />
    </div>
  );
};

export default PlayerDashboardPage;
