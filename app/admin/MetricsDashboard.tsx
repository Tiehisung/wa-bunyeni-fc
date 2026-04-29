'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  TrendingDown,
  Minus,
  Users,
  Target,
  Shield,
  Calendar,
  Activity,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetDashboardMetricsQuery } from "@/services/metrics.endpoints";
import { getResultIcon, getResultTextColor } from "@/utils/match";

interface MetricsDashboardProps {
  className?: string;
}

export function MetricsDashboard({ className }: MetricsDashboardProps) {
  const { data: dashboard } = useGetDashboardMetricsQuery({});
  const metrics = dashboard?.data;
  const matchStats = metrics?.matchStats;

  const wins = matchStats?.wins || 0;
  const draws = matchStats?.draws || 0;
  const losses = matchStats?.losses || 0;
  const totalMatches = matchStats?.totalMatches || 0;
  const winRate = matchStats?.winRate as string;
  const goalsScored = matchStats?.goalsScored || 0;
  const goalsConceded = matchStats?.goalsConceded || 0;
  const goalDifference = matchStats?.goalDifference || 0;
  const recentForm = matchStats?.recentForm;

  const winRateNumber = parseFloat(winRate);
  const goalsPerGame = (goalsScored / totalMatches).toFixed(1);
  const goalsConcededPerGame = (goalsConceded / totalMatches).toFixed(1);
  const points = wins * 3 + draws;
  const pointsPerGame = Number((points / totalMatches).toFixed(1));

  const getResultColor = (result: string) => {
    switch (result) {
      case "win":
        return "bg-green-500";
      case "draw":
        return "bg-yellow-500";
      case "loss":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Players</p>
                <p className="text-3xl font-bold">{metrics?.activePlayers}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Matches</p>
                <p className="text-3xl font-bold">{totalMatches}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-full">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-3xl font-bold text-green-600">{winRate}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-full">
                <Trophy className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Points</p>
                <p className="text-3xl font-bold">{points}</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-full">
                <Award className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Record & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Record Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Record</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-green-600" />
                <span className="font-medium">Wins</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{wins}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Minus className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">Draws</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">
                {draws}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <span className="font-medium">Losses</span>
              </div>
              <span className="text-2xl font-bold text-red-600">{losses}</span>
            </div>
          </CardContent>
        </Card>

        {/* Goals Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-600" />
                <span className="font-medium">Scored</span>
              </div>
              <span className="text-2xl font-bold">{goalsScored}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-red-600" />
                <span className="font-medium">Conceded</span>
              </div>
              <span className="text-2xl font-bold">{goalsConceded}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Difference</span>
              </div>
              <span
                className={cn(
                  "text-2xl font-bold",
                  goalDifference >= 0 ? "text-green-600" : "text-red-600",
                )}
              >
                {goalDifference >= 0 ? `+${goalDifference}` : goalDifference}
              </span>
            </div>

            <div className="pt-3 border-t">
              <div className="flex justify-between text-sm mb-2">
                <span>Scoring Rate</span>
                <span>{goalsPerGame} per match</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-green-600 rounded-full h-2"
                  style={{
                    width: `${(goalsScored / (goalsScored + goalsConceded)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Win Rate</span>
                <span>{winRate}</span>
              </div>
              <Progress value={winRateNumber} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Points Per Game</span>
                <span>{pointsPerGame}</span>
              </div>
              <Progress value={(pointsPerGame / 3) * 100} className="h-2" />
            </div>

            {/* <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Clean Sheets</span>
                <span>
                  {recentForm?.filter((m) => m?.opponentGoals === 0).length ||
                    0}
                </span>
              </div>
              <Progress
                value={
                  ((recentForm?.filter((m) => m.opponentGoals === 0).length ||
                    0) /
                    totalMatches) *
                  100
                }
                className="h-2"
              />
            </div> */}
          </CardContent>
        </Card>
      </div>

      {/* Recent Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Form</CardTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Last {recentForm?.length} matches
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
            {recentForm?.map((match, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg text-center",
                  getResultTextColor(match.result),
                )}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  {getResultIcon(match.result)}
                  <span className="text-xs font-medium uppercase">
                    {match.result}
                  </span>
                </div>
                <p className="text-lg font-bold">{match.scoreline}</p>
                <p className="text-xs truncate">{match.opponent.name}</p>
              </div>
            ))}
          </div>

          {/* Form Timeline */}
          <div className="flex items-center gap-1 justify-center">
            {recentForm?.map((match, index) => (
              <div
                key={index}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white",
                  getResultColor(match.result),
                )}
              >
                {match.result === "win"
                  ? "W"
                  : match.result === "draw"
                    ? "D"
                    : "L"}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Season Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{goalsPerGame}</p>
              <p className="text-sm text-muted-foreground">Goals per game</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{goalsConcededPerGame}</p>
              <p className="text-sm text-muted-foreground">Conceded per game</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{points}</p>
              <p className="text-sm text-muted-foreground">Total points</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{pointsPerGame}</p>
              <p className="text-sm text-muted-foreground">Points per game</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
