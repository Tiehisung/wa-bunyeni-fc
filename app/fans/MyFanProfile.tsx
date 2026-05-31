// components/fan/MyFanProfile.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Heart, Star, Crown, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getFanBadgeIcon } from "@/types/fan.interface";
import { motion } from "framer-motion";
import { useGetMyFanProfileQuery } from "@/services/fans.endpoints";

export function MyFanProfile() {
  const { data: fanData, isLoading } = useGetMyFanProfileQuery();
  const fan = fanData?.data;

  console.log({fanData})

  if (isLoading) {
    return <MyFanProfileSkeleton />;
  }

  if (!fan) {
    return (
      <Card className="bg-linear-to-r from-primary/10 to-primary/5">
        <CardContent className="p-6 text-center">
          <Heart className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">
            Join the fan club to start earning points!
          </p>
        </CardContent>
      </Card>
    );
  }

  const rankColor =
    fan.rank === 1
      ? "text-yellow-500"
      : fan.rank === 2
        ? "text-gray-400"
        : fan.rank === 3
          ? "text-amber-600"
          : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-0 shadow-xl bg-linear-to-br from-card to-muted/20">
        {/* Header Banner */}
        <div className="bg-linear-to-r from-primary/20 via-primary/10 to-transparent p-6 pb-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Your Fan Status</p>
              <h2 className="text-2xl font-bold">Fan Profile</h2>
            </div>
            {fan.rank && fan.rank <= 10 && (
              <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full">
                <Crown className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-semibold">
                  Top {fan.rank} Fan
                </span>
              </div>
            )}
          </div>
        </div>

        <CardContent className="px-6 pb-6 -mt-8">
          {/* Points Card */}
          <div className="bg-background rounded-xl shadow-lg p-5 mb-6 border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">Total Points</span>
              </div>
              {fan.rank && (
                <div className="flex items-center gap-1">
                  <Star className={`h-4 w-4 ${rankColor}`} />
                  <span className={`text-sm font-semibold ${rankColor}`}>
                    Rank #{fan.rank}
                  </span>
                </div>
              )}
            </div>
            <p className="text-4xl font-bold text-primary">
              {fan.points.toLocaleString()}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-muted-foreground">
                  {fan.engagementScore}% engagement
                </span>
              </div>
            </div>
          </div>

          {/* Badges Section */}
          {fan.badges.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-3 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Earned Badges
              </p>
              <div className="flex flex-wrap gap-2">
                {fan.badges.map((badge) => (
                  <Badge
                    key={badge}
                    variant="secondary"
                    className="gap-1 px-3 py-1.5 text-xs"
                  >
                    <span>{getFanBadgeIcon(badge)}</span>
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Contribution Stats */}
          <div>
            <p className="text-sm font-medium mb-3">Contributions</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-muted/30 rounded-lg p-2">
                <p className="text-lg font-semibold">
                  {fan.contributions.comments}
                </p>
                <p className="text-xs text-muted-foreground">Comments</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-2">
                <p className="text-lg font-semibold">
                  {fan.contributions.reactions}
                </p>
                <p className="text-xs text-muted-foreground">Reactions</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-2">
                <p className="text-lg font-semibold">
                  {fan.contributions.shares}
                </p>
                <p className="text-xs text-muted-foreground">Shares</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MyFanProfileSkeleton() {
  return (
    <Card className="border-0 shadow-xl">
      <div className="bg-muted p-6 pb-12">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-40 mt-1" />
      </div>
      <CardContent className="px-6 pb-6 -mt-8">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="mt-4">
          <Skeleton className="h-5 w-28 mb-3" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
