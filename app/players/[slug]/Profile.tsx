"use client";

import CardCarousel from "@/components/carousel/cards";
import { usePlayerGalleryUtils } from "@/hooks/usePlayerGallery";
import { IGallery } from "@/types/file.interface";
import { scrollToElement } from "@/lib/dom";
import { generatePlayerAbout } from "@/data/about";
import GalleryGrid from "@/components/Gallery/GallaryGrid";
import { IPlayerStats } from "@/types/stats";
import { TEAM } from "@/data/team";
import Link from "next/link";
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
import { useState } from "react";

// Default placeholder image for fallbacks
const DEFAULT_AVATAR = "/images/placeholder-player.png";
const DEFAULT_GALLERY_IMAGE = "/images/placeholder-image.jpg";

interface PageProps {
  stats?: IPlayerStats;
}

// Helper function to safely get image URL
const getSafeImageUrl = (url: string | undefined, fallback: string = DEFAULT_AVATAR): string => {
  if (!url || url.trim() === "") {
    return fallback;
  }
  return url;
};

// Helper for gallery images
const getSafeGalleryImage = (file: any): { src: string; alt: string } => {
  const src = file?.secure_url && file.secure_url.trim() !== "" 
    ? file.secure_url 
    : DEFAULT_GALLERY_IMAGE;
  const alt = file?.description && file.description.trim() !== "" 
    ? file.description 
    : "Gallery image";
  return { src, alt };
};

export default function PlayerProfile({ stats }: PageProps) {
  const { slug } = useParams();
  const [mainImageError, setMainImageError] = useState(false);
  
  const {
    data: playerData,
    isLoading,
    error,
  } = useGetPlayerQuery((slug as string) ?? "");

  const player = playerData?.data;
  const { data: galleriesData } = useGetGalleriesQuery({ tags: player?._id }, {
    skip: !player?._id,
  });
  const { data: statsData } = useGetPlayerStatsQuery(player?._id as string, {
    skip: !player?._id,
  });

  const { images } = usePlayerGalleryUtils(galleriesData?.data);
  
  // Safe slides generation with error handling
  const slides = images?.slice(0, 10)?.map((file) => {
    const { src, alt } = getSafeGalleryImage(file);
    return (
      <div key={file?.public_id || Math.random()}>
        <div className="relative w-full h-72">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // Fallback to placeholder on error
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_GALLERY_IMAGE;
            }}
          />
        </div>
        {file?.description && (
          <p className="mt-2 text-sm text-muted-foreground">{file.description}</p>
        )}
      </div>
    );
  }) ?? [];

  if (isLoading) {
    return <PageLoader />;
  }

  if (error && !isLoading) {
    return <DataErrorAlert message={error} />;
  }

  const averageRating =
    stats?.ratings && stats.ratings.length
      ? (
          stats.ratings.reduce((sum, r) => sum + r.rating, 0) /
          stats.ratings.length
        ).toFixed(1)
      : "0";

  // Safe player avatar URL
  const playerAvatar = mainImageError 
    ? DEFAULT_AVATAR 
    : getSafeImageUrl(player?.avatar);

  // Safe team logo URL
  const teamLogo = TEAM?.logo && TEAM.logo.trim() !== "" 
    ? TEAM.logo 
    : DEFAULT_AVATAR;

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
              {player?.position || "Player"}
            </p>
            <h2 className="text-5xl font-bold mt-2">
              {player?.lastName || "Unknown"}{" "}
              <span className="text-muted-foreground">{player?.firstName || "Player"}</span>
            </h2>
          </div>

          {/* Player video/image - Fixed sizing */}
          <div className="relative rounded-xl overflow-hidden mb-6 bg-gray-100 aspect-video">
            {playerAvatar ? (
              <Image
                src={playerAvatar}
                alt={player?.lastName || "Player avatar"}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                onError={() => setMainImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Description */}
          {player && (
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
          )}

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
          {slides && slides.length > 0 ? (
            <CardCarousel cards={slides} effect="flip" />
          ) : (
            <div className="w-full h-72 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">No gallery images available</p>
            </div>
          )}

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
              <div className="relative w-20 h-20">
                <Image
                  src={teamLogo}
                  alt={player?.training?.team || "Team logo"}
                  fill
                  className="object-contain"
                  sizes="80px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = DEFAULT_AVATAR;
                  }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  Sponsor <strong>Me</strong>
                </p>
                <p className="text-xs text-gray-200">GHS50</p>
              </div>
            </div>
          </div>

          <ResourceShare
            title={`${player?.firstName || ""} ${player?.lastName || ""}`}
            text={`Check out ${player?.firstName || ""} ${player?.lastName || ""} from Bunyeni FC!`}
          />
        </div>

        {/* Radar Chart */}
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