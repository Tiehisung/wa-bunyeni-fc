// components/fan/FanStatsWidget.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Trophy, TrendingUp, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CountUp from "react-countup";
import { useGetFanStatsQuery } from "@/services/fans.endpoints";

export function FanStatsWidget() {
  const { data: stats, isLoading } = useGetFanStatsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Fans",
      value: stats?.data?.totalFans || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Points",
      value: stats?.data?.totalPoints || 0,
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Avg Engagement",
      value: stats?.data?.averageEngagement || 0,
      suffix: "%",
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Active Fans",
      value: stats?.data?.totalFans || 0,
      icon: Award,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((card) => (
        <Card key={card.title} className="overflow-hidden border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-xl ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold">
              <CountUp end={card.value} duration={1.5} />
              {card.suffix || ""}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{card.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
