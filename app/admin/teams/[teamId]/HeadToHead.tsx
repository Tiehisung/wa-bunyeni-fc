"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Shield,
  Calendar,
  MapPin,
  Home,
  Users,
  Activity,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/timeAndDate";
import { useGetHeadToHeadMetricsQuery } from "@/services/metrics.endpoints";

import { ENV } from "@/lib/env";
import PageLoader from "@/components/loaders/Page";
import { useParams } from "next/navigation";

interface HeadToHeadProps {
  className?: string;
}

export function HeadToHead({ className }: HeadToHeadProps) {
  const { teamId } = useParams();
  const { data: headToHeadData, isLoading } = useGetHeadToHeadMetricsQuery(
    teamId as string,
  );

  console.log({headToHeadData})

  const data = headToHeadData?.data;

  const getResultColor = (result: string) => {
    switch (result) {
      case "win":
        return "text-green-600 bg-green-100 dark:bg-green-950/30";
      case "draw":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-950/30";
      case "loss":
        return "text-red-600 bg-red-100 dark:bg-red-950/30";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case "win":
        return <TrendingUp className="w-4 h-4" />;
      case "draw":
        return <Minus className="w-4 h-4" />;
      case "loss":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case "win":
        return "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400";
      case "draw":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400";
      case "loss":
        return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400";
      default:
        return "";
    }
  };
  if (isLoading) return <PageLoader />;
  return (
    <div className={cn("space-y-6 my-8", className)}>
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted overflow-hidden">
                {data?.opponent.logo ? (
                  <img
                    src={data?.opponent.logo}
                    alt={data?.opponent?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-2xl">Head to Head</CardTitle>
                <p className="text-muted-foreground">
                  {ENV.TEAM_NAME} vs {data?.opponent?.name}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {data?.totalMatches} Matches
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-5 h-5 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{data?.wins}</p>
            <p className="text-sm text-muted-foreground">Wins</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Minus className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{data?.draws}</p>
            <p className="text-sm text-muted-foreground">Draws</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingDown className="w-5 h-5 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{data?.losses}</p>
            <p className="text-sm text-muted-foreground">Losses</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{data?.winRate}</p>
            <p className="text-sm text-muted-foreground">Win Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Goal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="font-medium">Goals Scored</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {data?.goalsScored}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                <span className="font-medium">Goals Conceded</span>
              </div>
              <span className="text-2xl font-bold text-red-600">
                {data?.goalsConceded}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Goal Difference</span>
              </div>
              <span
                className={cn(
                  "text-2xl font-bold",
                  data?.goalDifference || 0 >= 0
                    ? "text-green-600"
                    : "text-red-600",
                )}
              >
                {(data?.goalDifference || 0) >= 0
                  ? `+${data?.goalDifference}`
                  : data?.goalDifference}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Match History */}
      <Card>
        <CardHeader className="max-sm:p-3">
          <CardTitle className="text-lg">Match History</CardTitle>
        </CardHeader>
        <CardContent className="max-sm:p-3">
          <div className="space-y-4">
            {data?.matches?.map((match, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg border transition-all hover:shadow-md",
                  getResultColor(match.result),
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* Date and Venue */}
                  <div className="flex items-center gap-3">
                    <div className="text-center min-w-15">
                      <Calendar className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs font-medium">
                        {formatDate(match.date)}
                      </p>
                    </div>

                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {match.isHome ? (
                        <>
                          <Home className="w-3 h-3" />
                          Home
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3 h-3" />
                          Away
                        </>
                      )}
                    </Badge>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-4">
                    <p className="text-right font-semibold">{ENV.TEAM_NAME}</p>

                    <div className="text-center text-sm font-mono font-bold text-nowrap">
                      {match.scoreline}
                    </div>

                    <p className="text-left font-semibold">
                      {data?.opponent?.name}
                    </p>
                  </div>

                  {/* Result Badge */}
                  <Badge
                    className={cn("capitalize", getResultBadge(match?.result))}
                  >
                    <div className="flex items-center gap-1">
                      {getResultIcon(match.result)}
                      {match.result}
                    </div>
                  </Badge>
                </div>

                {/* Goal Details (optional) */}
                {(match?.teamGoals?.length > 0 ||
                  match?.opponentGoals?.length > 0) && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        {match?.teamGoals?.length > 0 && (
                          <div className="space-y-1">
                            <p className="font-medium text-green-600">
                              Goalscorers
                            </p>
                            {match?.teamGoals?.map((goal) => (
                              <p
                                key={goal._id}
                                className="text-muted-foreground"
                              >
                                ⚽ {goal.minute}' • {goal.description || "Goal"}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        {match?.opponentGoals?.length > 0 && (
                          <div className="space-y-1">
                            <p className="font-medium text-red-600">
                              Opponent Goals
                            </p>
                            {match?.opponentGoals?.map((goal) => (
                              <p
                                key={goal?._id}
                                className="text-muted-foreground"
                              >
                                ⚽ {goal?.minute || ""}' •{" "}
                                {goal?.description || "Goal"}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
