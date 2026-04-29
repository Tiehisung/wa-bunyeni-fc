import { MetricCard } from "@/components/Metrics/Cards";
import { TColor } from "@/types/color";
import { IPlayer } from "@/types/player.interface";

import {
  Target,
  Crosshair,
  Trophy,
  Zap,
  Activity,
  Award,
  Shield,
} from "lucide-react";

interface StatsCardsProps {
  player?: IPlayer;
}

export function StatsCards({ player }: StatsCardsProps) {
  const stats = [
    {
      title: "Goals",
      value: (player?.goals?.length || 0)?.toString(),
      icon: Target,
      color: "red",
      bgColor: "bg-red-50",
    },
    {
      title: "Assists",
      value: (player?.assists?.length || 0)?.toString(),
      icon: Crosshair,
      color: "blue",
      bgColor: "bg-blue-50",
    },
    {
      title: "Trophies",
      value: (player?.trophies || 0)?.toString(),
      icon: Trophy,
      color: "amber",
      bgColor: "bg-amber-50",
    },
    {
      title: "MVP Awards",
      value: (player?.mvp?.length || 0)?.toString(),
      icon: Award,
      color: "purple",
      bgColor: "bg-purple-50",
    },
    {
      title: "Pass Accuracy",
      value: player?.passAcc
        ? player.passAcc.includes("%")
          ? player.passAcc
          : `${player.passAcc}%`
        : "0%",
      icon: Zap,
      color: "green",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Matches",
      value: (player?.matches?.length || 0)?.toString(),
      icon: Activity,
      color: "indigo",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Yellow Cards",
      value: (
        player?.cards?.filter((c) => c?.type?.toLowerCase() === "yellow")
          .length || 0
      )?.toString(),
      icon: Shield,
      color: "yellow",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Red Cards",
      value: (
        player?.cards?.filter((c) => c?.type?.toLowerCase() === "red").length ||
        0
      )?.toString(),
      icon: Shield,
      color: "red",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <MetricCard
            key={index}
            title={stat.title}
            color={stat.color as TColor}
            icon={<Icon />}
            value={stat.value}
          />
        );
      })}
    </div>
  );
}
