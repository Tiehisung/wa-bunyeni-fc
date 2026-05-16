// components/admin/AdminFanStats.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Trophy, TrendingUp, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CountUp from "react-countup";
import { useGetFanStatsQuery } from "@/services/fans.endpoints";

export function AdminFanStats() {
  const { data: stats, isLoading } = useGetFanStatsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Fans",
      value: stats?.totalFans || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      change: "+12%",
    },
    {
      title: "Total Points",
      value: stats?.totalPoints || 0,
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      change: "+8%",
    },
    {
      title: "Avg Engagement",
      value: stats?.averageEngagement || 0,
      suffix: "%",
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      change: "+5%",
    },
    // {
    //   title: "Badges Awarded",
    //   value: Object.values(stats?.badgeDistribution || {}).reduce(
    //     (a, b) => a + b,
    //     0,
    //   ),
    //   icon: Award,
    //   color: "text-purple-500",
    //   bgColor: "bg-purple-500/10",
    //   change: "+15%",
    // },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card) => (
        <Card
          key={card.title}
          className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow"
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold">
              <CountUp end={card.value as number} duration={1.5} />
              {card.suffix || ""}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{card.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
