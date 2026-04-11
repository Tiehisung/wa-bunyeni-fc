'use client'

import { AnimateOnView } from "@/components/Animate/AnimateOnView";
import Loader from "@/components/loaders/Loader";
import { symbols } from "@/data";
import { getInitials, shortText } from "@/lib";
import { formatDate, getTimeLeftOrAgo } from "@/lib/timeAndDate";
import { useGetSquadsQuery } from "@/services/squad.endpoints";
import { ISquad } from "@/types/squad.interface";
import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  squad?: ISquad;
}
// Large Screen Component (Desktop)
const Desktop: React.FC<Props> = ({ squad }) => {
  if (!squad) return;
  return (
    <div className="w-full max-w-6xl mx-auto overflow-hidden">
      {/* Trending Header */}
      <div className="flex items-center gap-2 my-6">
        <span className=" font-semibold text-3xl tracking-wide">
          SQUAD - {squad?.title || "Latest Fixture Squad"}
        </span>
      </div>

      {/* Hero Section with Main Image */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <Image
          src={squad?.coach?.avatar || (squad?.assistant?.avatar as string)}
          alt="International break action"
          className="w-full h-full object-cover"
          width={400}
          height={320}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
            {squad?.title}
          </h2>
          <p className="text-white/90 text-sm md:text-base max-w-2xl">
            {squad?.description}
          </p>
          {squad?.match && (
            <div className="flex items-center gap-2 pt-2 text-white">
              <Calendar size={14} />
              {formatDate(squad?.match?.date, "MAR 28, 2025")}{" "}
              {`${symbols.dot} ${getTimeLeftOrAgo(squad?.match?.date).formatted}`}
            </div>
          )}
        </div>
      </div>

      {/* Trending Items Grid */}
      <div className="py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {squad?.players?.slice(0, 3)?.map((player) => (
            <div
              key={player?._id}
              className="group bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border "
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={player?.avatar}
                  alt={player?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-primary capitalize text-white text-xs font-semibold px-2 py-1 rounded">
                  {player?.position}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {player?.name}
                    </h3>
                    <Link
                      href={`/players/details?playerId=${player?._id}`}
                      className="flex items-center gap-1 text-primary text-sm font-medium"
                    >
                      <span>Read more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See More Link */}
        <div className="flex justify-end border-t pt-6 mt-4">
          <Link
            href={"/squad"}
            className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group"
          >
            <span>SQUAD {shortText(squad?.title as string)} - SEE MORE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Mobile Screen Component
const Mobile: React.FC<Props> = ({ squad }) => {
  return (
    <div className="w-full overflow-hidden">
      {/* Trending Header - Compact */}
      <div className=" my-5 flex items-center gap-2">
        <span className=" font-semibold text-3xl tracking-wide">
          SQUAD- {squad?.title || "Latest Fixture Squad"}
        </span>
      </div>

      {/* Hero Section with Main Image - Mobile */}
      <div className="relative max-sm:h-[80vw] overflow-hidden">
        <img
          src={squad?.coach?.avatar || (squad?.assistant?.avatar as string)}
          alt="International break action"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-lg font-bold text-white mb-1 leading-tight">
            {squad?.title}
          </h2>
          <p className="text-white/80 text-xs line-clamp-2">
            {squad?.description}
          </p>
          {squad?.match?.date && (
            <div className="flex items-center gap-2 pt-2 text-white font-thin">
              <Calendar size={14} />
              {formatDate(squad?.match?.date, "MAR 28, 2025")}{" "}
              {`${symbols.dot} ${getTimeLeftOrAgo(squad?.match?.date).formatted}`}
            </div>
          )}
        </div>
      </div>

      {/* Trending Items List - Mobile with Images */}
      <div className="my-5">
        <div className=" mb-5 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {squad?.players?.slice(0, 6)?.map((player, index) => (
            <AnimateOnView key={player?._id} index={index*1.2} once={false}>
              <div className="group bg-card rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-border">
                <div className="relative h-32 overflow-hidden bg-gray-100">
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-primary uppercase font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                    {player?.number ||
                      getInitials(player?.position?.split(" "))}
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold md:font-bold text-sm md:text-xl ">
                    {player.name}
                  </h3>
                  <p className="text-primary text-sm mb-1 font-semibold capitalize">
                    {player.position}
                  </p>
                </div>
              </div>
            </AnimateOnView>
          ))}
        </div>

        {/* See More Link - Compact */}
        <div className="border-t pt-4">
          <Link
            href={`/squad`}
            className="flex items-center justify-between w-full text-primary font-semibold text-sm"
          >
            <span>
              SQUAD {shortText(squad?.title as string) || "SQUAD"} - SEE MORE
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Main Responsive Component
interface TrendingProps {
  className?: string;
  // data: INewsSectionProps;
}

const LandingMatchSquad: React.FC<TrendingProps> = ({ className = "" }) => {
  const { data: squadsData, isLoading } = useGetSquadsQuery("");
  const squad = squadsData?.data ? squadsData?.data[0] : undefined;

  console.log({ squad });

  if (isLoading) {
    return (
      <div className="py-12 px-4 space-y-8 _page flex justify-center items-center min-h-100">
        <Loader message="Loading squad..." />
      </div>
    );
  }
  return (
    <div className={`container ${className}`} id="squad">
      <div className="hidden md:block">
        <Desktop squad={squad} />
      </div>

      <div className="block md:hidden">
        <Mobile squad={squad} />
      </div>
    </div>
  );
};

export default LandingMatchSquad;
