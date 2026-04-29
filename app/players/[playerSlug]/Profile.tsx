"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { IPlayer } from "@/types/player.interface";
import CardCarousel from "@/components/carousel/cards";
import { usePlayerGalleryUtils } from "@/hooks/usePlayerGallery";
import { IGallery } from "@/types/file.interface";
import { scrollToElement } from "@/lib/dom";
import { generatePlayerAbout } from "@/data/about";
import GalleryGrid from "@/components/Gallery/GallaryGrid";
import { IPlayerStats } from "@/types/stats";
import { TEAM } from "@/data/team";
import Link from "next/link";
import useGetParam from "@/hooks/params";
import { ResourceShare } from "@/components/SocialShare";
import Image from "next/image";
import {
  useGetPlayerQuery,
  useGetPlayerStatsQuery,
} from "@/services/player.endpoints";
import { useParams } from "next/navigation";
import DataErrorAlert from "@/components/error/DataError";
import PageLoader from "@/components/loaders/Page";
import { useGetGalleriesQuery } from "@/services/gallery.endpoints";

const statsData = [
  { stat: "PAS", value: 82 },
  { stat: "SHT", value: 90 },
  { stat: "PHY", value: 83 },
  { stat: "DEF", value: 54 },
  { stat: "SPD", value: 88 },
  { stat: "DRI", value: 87 },
];

interface PageProps {
   
  stats?: IPlayerStats;
}

export default function PlayerProfile({   stats }: PageProps) {
  const { playerSlug } = useParams();
  const {
    data: playerData,
    isLoading,
    error,
  } = useGetPlayerQuery((playerSlug as string) ?? "");

  const player = playerData?.data;
  const { data: galleriesData } = useGetGalleriesQuery(`tags=${player?._id}`, {
    skip: !player?._id,
  });
  const { data: statsData } = useGetPlayerStatsQuery(player?._id as string, {
    skip: !player?._id,
  });

  const { images } = usePlayerGalleryUtils(galleriesData?.data);
  const slides = images?.slice(0, 10)?.map((file) => (
    <div key={file?.public_id as string}>
      <Image
        src={file?.secure_url as string}
        alt={(file?.description as string) ?? "slide"}
        className="w-full h-72 object-cover"
        width={400}
        height={400}
      />
      <p>{file?.description}</p>
    </div>
  ));

  if (isLoading) {
    return <PageLoader />;
  }

  if (!error && !isLoading) {
    return <DataErrorAlert message={error} />;
  }

  const averageRating =
    stats?.ratings && stats.ratings.length
      ? (
          stats.ratings.reduce((sum, r) => sum + r.rating, 0) /
          stats.ratings.length
        ).toFixed(1)
      : "0";

  return (
    <main
      className="min-h-screen bg-accent flex flex-col items-center px-2 py-16"
      id="overview"
    >
      {/* Header */}
      <div className="flex gap-4 justify-between flex-wrap w-full max-w-6xl items-center mb-10">
        <h1 className="text-2xl font-semibold">
          ⚽ {TEAM.name} - Team{" "}
          <strong className="uppercase">{player?.training?.team || "A"}</strong>
        </h1>

        {/* Quick Links */}
        <nav className="flex gap-6 text-muted-foreground text-sm">
          {["overview", "gallery", "stats", "sponsor"].map((sec) => (
            <button
              key={sec}
              className="hover:text-popover-foreground cursor-pointer capitalize"
              onClick={() => scrollToElement(sec)}
            >
              {sec}
            </button>
          ))}
        </nav>
      </div>

      <section className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl">
        {/* Left Section */}
        <div className="flex-1">
          <div className="text-left mb-4 capitalize">
            <p className="bg-muted px-3 py-1 rounded-md text-xs w-fit">
              {player?.position}
            </p>
            <h2 className="text-5xl font-bold mt-2">
              {player?.lastName}{" "}
              <span className="text-muted-foreground">{player?.firstName}</span>
            </h2>
          </div>

          {/* Player video/image */}
          <div className="rounded-xl overflow-hidden mb-6">
            <img
              src={player?.avatar as string}
              alt={player?.lastName as string}
              className="w-auto max-h-[60vh] object-cover"
            />
          </div>

          {/* Description */}
          <div
            className="_p mb-5 font-semibold"
            dangerouslySetInnerHTML={{
              __html: generatePlayerAbout(
                player?.firstName ?? "",
                player?.lastName ?? "",
                player?.position,
              ),
            }}
          />

          {/* Social Links */}
          <div className="flex gap-4 mt-6 text-muted-foreground">
            <Link href="#" className="hover:text-popover-foreground">
              🐦
            </Link>
            <Link href="#" className="hover:text-popover-foreground">
              📷
            </Link>
            <Link href="#" className="hover:text-popover-foreground">
              👍
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 relative">
          <CardCarousel cards={slides} effect="flip" />

          {/* Trophies */}
          <div className="w-fit my-3">
            <h1 className="_label mb-3">TROPHIES</h1>
            <ul className="flex gap-6 justify-end mb-10 pb-3 border-b-2">
              {["🏆", "🥈", "🥇", "🏅", "🏆"].map((t, i) => (
                <li key={i} className="flex flex-col items-center">
                  <span className="text-2xl">{t}</span>
                  <span className="text-xs mt-1 text-muted-foreground">
                    {i + 1}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <section>
            <h1 className="_label mb-3">STATS</h1>
            <ul
              className="grid md:grid-cols-4 gap-6 text-center mb-8"
              id="stats"
            >
              <li className="_card">
                <p className="text-xl font-semibold">{averageRating}</p>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </li>
              <li className="_card">
                <p className="text-xl font-semibold">
                  {stats?.assists?.length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Assists</p>
              </li>
              <li className="_card">
                <p className="text-xl font-semibold">
                  {stats?.goals?.length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Goals</p>
              </li>
              <li className="_card">
                <p className="text-xl font-semibold">
                  {stats?.matches?.length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Matches</p>
              </li>
              <li className="_card">
                <p className="text-xl font-semibold">
                  {player?.mvp?.length ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">MVPs</p>
              </li>
              <li className="_card">
                <p className="text-xl font-semibold">
                  {player?.injuries?.length ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">Injuries</p>
              </li>
              <li className="_card">
                <p className="text-xl font-semibold">
                  {stats?.performanceScore || 0}
                </p>
                <p className="text-xs text-muted-foreground">Performance</p>
              </li>
            </ul>
          </section>

          {/* Product / Shirt */}
          <div className="mt-8 flex justify-end" id="sponsor">
            <div className="bg-linear-to-r from-purple-600 to-indigo-500 rounded-xl p-4 flex items-center gap-4 shadow-lg">
              <img
                src={TEAM.logo}
                alt={player?.training?.team as string}
                className="w-20"
              />
              <div>
                <p className="text-sm font-semibold">
                  Sponsor <strong>Me</strong>
                </p>
                <p className="text-xs text-gray-200">GHS50</p>
              </div>
            </div>
          </div>

          <ResourceShare
            title={`${player?.firstName} ${player?.lastName}`}
            text={`Check out ${player?.firstName} ${player?.lastName} from Bunyeni FC!`}
          />
        </div>

        {/* Radar Chart */}
      </section>

      <section className="h-64 w-full flex justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={statsData as any}>
            <PolarGrid stroke="#333" />
            <PolarAngleAxis dataKey="stat" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
            <Radar
              dataKey="value"
              stroke="#9b5cff"
              fill="#9b5cff"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </section>

      <section>
        <div className="my-6 _title p-4 flex items-center gap-6 justify-between">
          <span>GALLERIES</span>
        </div>
        <GalleryGrid galleries={galleriesData?.data as IGallery[]} />
      </section>
    </main>
  );
}
