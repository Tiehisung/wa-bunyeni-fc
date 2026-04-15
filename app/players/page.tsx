import { H } from "@/components/Element";
import OurPlayers from "./Display";
import { Metadata } from "next";
import { ENV } from "@/lib/env";
import {  baseApiUrl } from "@/lib/configs";

export const getPlayers = async (query?: string) => {
  try {
    const formatted = query ? (query?.includes("?") ? query : "?" + query) : "";
    const response = await fetch(`${baseApiUrl}/players${formatted || ""}`, {
      cache: "no-cache",
    });

    if (!response.ok) return null;

    return await response.json();
  } catch {
    return null;
  }
};

export const metadata: Metadata = {
  title: `Players | ${ENV.TEAM_NAME}`,
  description: `Meet the ${ENV.TEAM_NAME} squad. View complete player profiles, stats, bios, and career highlights. Get to know your favorite players including their positions, jersey numbers, and achievements.`,
  keywords: [
    `${ENV.TEAM_NAME} players`,
    "squad",
    "football team",
    "player stats",
    "team roster",
    "footballers",
  ],
  openGraph: {
    title: `Players | ${ENV.TEAM_NAME}`,
    description: `Meet the ${ENV.TEAM_NAME} squad. View player profiles, stats, and career highlights.`,
    url: `${ENV.APP_URL}/players`,
    siteName: ENV.TEAM_NAME,
    type: "website",
    images: [
      {
        url: `${ENV.APP_URL}/team-photo.jpg`,
        width: 1200,
        height: 630,
        alt: `${ENV.TEAM_NAME} Team Photo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Players | ${ENV.TEAM_NAME}`,
    description: `Meet the ${ENV.TEAM_NAME} squad. Player profiles and stats.`,
    images: [`${ENV.APP_URL}/team-photo.jpg`],
  },
  alternates: {
    canonical: `${ENV.APP_URL}/players`,
  },
};
const PlayersPage = async () => {
  return (
    <>
      <div className="">
         
        <H>Meet Our Gallant Players</H>
        <OurPlayers />
      </div>
    </>
  );
};

export default PlayersPage;
