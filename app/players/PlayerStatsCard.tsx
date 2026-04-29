 

import { AVATAR } from "@/components/ui/avatar";
import { getInitials } from "@/lib";
import { CSSProperties } from "react";

interface PlayerStatsCardProps {
  name: string;
  position: string;
  avatar: string;
  playerImage: string;
  goals: number;
  matches: number;
  assists: number;
  passAccuracy: number;
  trophies: number;
  className?: string;
  styles?: CSSProperties;
}

export default function PlayerFeatureStatsCard({
  name,
  position,
  avatar,
  playerImage,
  goals,
  matches,
  assists,
  passAccuracy,
  trophies,
  className,
  styles = {},
}: PlayerStatsCardProps) {
  return (
    <div
      style={{ backgroundImage: `url(${playerImage})`, ...styles }}
      className={`relative w-80 h-105 rounded-2xl overflow-hidden shadow-xl text-white flex flex-col items-center justify-end p-6 bg-no-repeat bg-cover bg-accent ${className}`}
    >
      <div className="absolute top-4 left-4 h-fit w-32">
        {/* Avatar */}
        <AVATAR
          src={avatar}
          alt={getInitials(name)}
        
        />
        {/* Player Info */}
        <div className="z-10 w-full text-left ">
          <h2 className="text-xl font-bold text-orange-400 uppercase">
            {name}
          </h2>
          <p className="text-xs tracking-wide uppercase ">{position}</p>
        </div>
      </div>

      {/* Goals */}
      <div className="absolute top-4 right-6 text-right">
        <p className="text-4xl font-extrabold leading-none">{goals}</p>
        <p className="text-sm font-semibold uppercase tracking-wide">Goals</p>
      </div>

      {/* overlay bg */}
      <div className="absolute inset-0 top-12 flex justify-center bg-linear-to-b from-transparent via-transparent to-modalOverlay" />

      {/* Stats */}
      <div className="w-full mt-4 border-t border-gray-700 pt-4 grid grid-cols-4 text-center text-xs uppercase z-10">
        <div>
          <p className="font-bold text-base">{matches}</p>
          <p className="text-white/70 font-semibold">Matches</p>
        </div>
        <div>
          <p className="font-bold text-base">{assists}</p>
          <p className="text-white/70 font-semibold">Assists</p>
        </div>
        <div>
          <p className="font-bold text-base">{passAccuracy}%</p>
          <p className="text-white/70 font-semibold">Pass Acc.</p>
        </div>
        <div>
          <p className="font-bold text-base">{trophies ?? 0}</p>
          <p className="text-white/70 font-semibold">Trophies</p>
        </div>
      </div>
    </div>
  );
}
