"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AVATAR } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { getFanBadgeIcon } from "@/types/fan.interface";
import { useGetFanLeaderboardQuery } from "@/services/fans.endpoints";

export function FanLeaderboard() {
  const [sortBy, setSortBy] = useState<"points" | "engagementScore">("points");
  const { data: leaderboard, isLoading } = useGetFanLeaderboardQuery({
    limit: 50,
    sortBy: sortBy,
  });

  console.log(leaderboard?.data);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return (
      <span className="text-sm font-medium text-muted-foreground w-5 text-center">
        {rank}
      </span>
    );
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
    if (rank === 2) return "bg-gray-400/20 text-gray-600 border-gray-400/30";
    if (rank === 3) return "bg-amber-600/20 text-amber-700 border-amber-600/30";
    return "";
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-linear-to-br from-background to-muted/20">
      <CardHeader className="pb-3 border-b bg-primary/5">
        <div className="flex flex-wrap items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Fan Leaderboard
          </CardTitle>
          <Tabs
            defaultValue="points"
            className="w-auto"
            onValueChange={(v) => setSortBy(v as any)}
          >
            <TabsList className="h-8">
              <TabsTrigger value="points" className="text-xs px-3">
                Points
              </TabsTrigger>
              <TabsTrigger value="engagementScore" className="text-xs px-3">
                Engagement
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Top fans ranked by{" "}
          {sortBy === "points" ? "points earned" : "engagement score"}
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <FanLeaderboardSkeleton />
        ) : !leaderboard?.data?.length ? (
          <div className="text-center py-12 text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No fans yet</p>
            <p className="text-sm">Be the first to earn points!</p>
          </div>
        ) : (
          <div className="divide-y">
            {leaderboard?.data?.map((entry, index) => (
              <motion.div
                key={entry.user?._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors ${getRankBadge(entry.rank)}`}
              >
                {/* Rank */}
                <div className="w-10 shrink-0 text-center">
                  {getRankIcon(entry.rank)}
                </div>

                {/* Avatar */}
                <AVATAR
                  src={entry.user?.avatar as string}
                  alt={entry.user?.name}
                />

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold truncate">{entry.user?.name}</p>
                    {entry.rank <= 3 && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        #{entry.rank} Fan
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.badges.slice(0, 3).map((badge) => (
                      <span
                        key={badge}
                        className="text-xs bg-secondary/50 px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5"
                        title={badge}
                      >
                        <span>{getFanBadgeIcon(badge)}</span>
                      </span>
                    ))}
                    {entry.badges.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{entry.badges.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right shrink-0">
                  {sortBy === "points" ? (
                    <>
                      <p className="text-xl font-bold text-primary">
                        {entry.points}
                      </p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-bold text-primary">
                        {entry.engagementScore}%
                      </p>
                      <p className="text-xs text-muted-foreground">score</p>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FanLeaderboardSkeleton() {
  return (
    <div className="divide-y">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 p-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24 mt-1" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}
