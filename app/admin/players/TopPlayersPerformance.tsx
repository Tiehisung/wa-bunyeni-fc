"use client";

import { PrimaryCollapsible } from "@/components/Collapsible";
import { CgPerformance } from "react-icons/cg";

import { CardHeader, CardTitle, CardContent, Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Goal, Medal } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useGetPlayersOverviewMetricsQuery } from "@/services/metrics.endpoints";
import { getPositionIcon } from "@/utils/player";

export default function TopPerformingPlayers() {
  const { currentData } = useGetPlayersOverviewMetricsQuery({});
  const metrics = currentData?.data;

  const totalPlayers = metrics?.total || 0;
  const topScorers = metrics?.topScorers;
  const topAssists = metrics?.topAssists;
  const byPosition = metrics?.byPosition;

  return (
    <PrimaryCollapsible
      header={{
        icon: <CgPerformance size={20} />,
        label: <div className="text-xl font-semibold">TOP PERFORMERS</div>,
        className: "ring grow",
      }}
    >
      <p className="_p">Leading scorers and playmakers</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Scorers */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Goal className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-lg">Top Scorers</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(topScorers?.length || 0) > 0 ? (
                topScorers?.map((player, index) => (
                  <div
                    key={player._id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className={cn("text-xs")}>
                            {player.position}
                          </Badge>
                          <span>#{player.number}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">
                        {player.goalCount || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">goals</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No goals recorded yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Assists */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Medal className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">Top Assists</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(topAssists?.length || 0) > 0 ? (
                topAssists?.map((player, index) => (
                  <div
                    key={player._id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className={cn("text-xs")}>
                            {player.position}
                          </Badge>
                          <span>#{player.number}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {player.assistCount || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">assists</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No assists recorded yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Position Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {byPosition?.map((position) => (
              <div key={position._id}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    {getPositionIcon(position._id)}
                    <span className="capitalize">{position._id}</span>
                  </div>
                  <span className="font-medium">{position.count}</span>
                </div>
                <Progress
                  value={(position.count / totalPlayers) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PrimaryCollapsible>
  );
}
