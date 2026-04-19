"use client";

import MatchFliers from "@/app/admin/matches/[matchSlug]/Fliers";
import HEADER from "@/components/Element";
import DataErrorAlert from "@/components/error/DataError";
import PageLoader from "@/components/loaders/Page";
import { checkMatchMetrics } from "@/lib/compute/match";
import { ENV } from "@/lib/env";
import { getErrorMessage } from "@/lib/error";
import { formatDate } from "@/lib/timeAndDate";
import { useGetMatchQuery } from "@/services/match.endpoints";
import { Calendar, Clock, MapPin, Medal, Trophy, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MatchDetailsClient({ slug }: { slug: string }) {
  const { data, isLoading, error } = useGetMatchQuery(slug);

  const match = data?.data;

  const isFinished = match?.status === "FT";
  const isLive = match?.status === "LIVE";
  const isUpcoming = match?.status === "UPCOMING";
  const matchMetrics = checkMatchMetrics(match);

  const homeTeam = matchMetrics.teams.home;
  const awayTeam = matchMetrics.teams.away;

  const homeScore = matchMetrics.goals.home || 0;
  const awayScore = matchMetrics.goals?.away || 0;

  const teamGoals = matchMetrics.goals.teamGoals;

  const opponentGoals = matchMetrics.goals.opponentGoals || [];

  const getStatusBadge = () => {
    if (isLive) return { text: "LIVE", className: "bg-red-500 animate-pulse" };
    if (isFinished) return { text: "FULL TIME", className: "bg-gray-500" };
    return { text: "UPCOMING", className: "bg-blue-500" };
  };

  const status = getStatusBadge();
  if (isLoading) {
    return <PageLoader />;
  }

  if (error && !isLoading) {
    return (
      <div>
        <HEADER title="Match" />
        <DataErrorAlert message={getErrorMessage(error)} />
      </div>
    );
  }
  return (
    <main className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          {/* Status Badge */}
          <div className="flex justify-center mb-6">
            <span
              className={`${status.className} text-white text-sm font-semibold px-4 py-1 rounded-full uppercase tracking-wider`}
            >
              {status.text}
            </span>
          </div>

          {/* Scoreboard */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
            {/* Home Team */}
            <div className="flex-1 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Image
                  src={homeTeam?.logo as string}
                  alt={homeTeam?.name || "Home Team"}
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-xl font-semibold">{homeTeam?.name}</h2>
            </div>

            {/* Score */}
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-bold font-mono">
                {isUpcoming ? "VS" : `${homeScore} - ${awayScore}`}
              </div>
              {isFinished && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {match?.computed?.result === "win"
                    ? `${ENV.TEAM_NAME} Victory`
                    : match?.computed?.result === "loss"
                      ? `${ENV.TEAM_NAME} Defeat`
                      : "Draw"}
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex-1 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Image
                  src={awayTeam.logo as string}
                  alt={awayTeam?.name || "Away Team"}
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-xl font-semibold">{awayTeam?.name}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Match Info Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-card rounded-lg p-4 text-center border">
            <Calendar className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-medium">{formatDate(match?.date)}</p>
          </div>
          <div className="bg-card rounded-lg p-4 text-center border">
            <Clock className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Time</p>
            <p className="font-medium">{match?.time || "TBD"}</p>
          </div>
          <div className="bg-card rounded-lg p-4 text-center border">
            <MapPin className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Venue</p>
            <p className="font-medium">{match?.venue?.name || "TBD"}</p>
          </div>
          <div className="bg-card rounded-lg p-4 text-center border">
            <Users className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Competition</p>
            <p className="font-medium">{match?.competition || "Friendly"}</p>
          </div>
        </div>
      </div>

      {/* Goalscorers Section */}
      {((teamGoals?.length || 0) > 0 || opponentGoals?.length > 0) && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Goalscorers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Our Goals */}
              <div className="bg-card rounded-lg border overflow-hidden">
                <div className="bg-primary/10 px-4 py-2 border-b">
                  <h4 className="font-semibold text-primary">
                    {ENV.TEAM_NAME}
                  </h4>
                </div>
                <div className="divide-y">
                  {teamGoals?.map((goal, idx) => (
                    <div
                      key={goal._id || idx}
                      className="px-4 py-2 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        {goal.scorer?.avatar && (
                          <Image
                            src={goal.scorer.avatar}
                            alt={goal.scorer.name || "Player"}
                            width={24}
                            height={24}
                            className="rounded-full object-cover"
                          />
                        )}
                        <span className="font-medium">
                          {goal.scorer?.name || "Team player"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {goal.assist?.name && (
                          <span className="text-xs text-muted-foreground">
                            (assist: {goal.assist.name})
                          </span>
                        )}
                        <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                          {goal.minute}'
                        </span>
                      </div>
                    </div>
                  ))}
                  {teamGoals?.length === 0 && (
                    <div className="px-4 py-3 text-center text-muted-foreground text-sm">
                      No goals scored
                    </div>
                  )}
                </div>
              </div>

              {/* Opponent Goals */}
              <div className="bg-card rounded-lg border overflow-hidden">
                <div className="bg-muted px-4 py-2 border-b">
                  <h4 className="font-semibold">
                    {match?.opponent?.name || "Opponent"}
                  </h4>
                </div>
                <div className="divide-y">
                  {opponentGoals.map((goal, idx) => (
                    <div
                      key={goal._id || idx}
                      className="px-4 py-2 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        {goal.scorer?.avatar && (
                          <Image
                            src={goal.scorer.avatar}
                            alt={goal.scorer.name || "Player"}
                            width={24}
                            height={24}
                            className="rounded-full object-cover"
                          />
                        )}
                        <span className="font-medium">
                          {goal.scorer?.name || "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {goal.assist?.name && (
                          <span className="text-xs text-muted-foreground">
                            (assist: {goal.assist.name})
                          </span>
                        )}
                        <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                          {goal.minute}'
                        </span>
                      </div>
                    </div>
                  ))}
                  {opponentGoals.length === 0 && (
                    <div className="px-4 py-3 text-center text-muted-foreground text-sm">
                      No goals scored
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cards Section */}
      {match?.cards && match?.cards.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Medal className="w-5 h-5" />
              Cards
            </h3>
            <div className="bg-card rounded-lg border overflow-hidden">
              {match?.cards.map((card, idx) => (
                <div
                  key={card._id || idx}
                  className="px-4 py-2 border-b last:border-0 flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${card.type === "red" ? "text-red-500" : "text-yellow-500"}`}
                    >
                      {card.type === "red" ? "🟥" : "🟨"}{" "}
                      {card.type.toUpperCase()}
                    </span>
                    <span>{card.player?.name || "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {card.description && (
                      <span className="text-xs text-muted-foreground">
                        {card.description}
                      </span>
                    )}
                    <span className="text-sm font-mono">{card.minute}'</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto">
        <MatchFliers match={match} />
      </div>

      <div className="container mx-auto px-4 py-8 text-center">
        <Link
          href="/matches"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Fixtures
        </Link>
      </div>
    </main>
  );
}
