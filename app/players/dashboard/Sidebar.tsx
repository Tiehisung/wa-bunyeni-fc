import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AVATAR } from "@/components/ui/avatar";
import {
  Calendar,
  Ruler,
  Cake,
  Heart,
  Shield,
  Users,
  AlertTriangle,
} from "lucide-react";

import { EPlayerFitness, IPlayer } from "@/types/player.interface";
import { formatDate } from "@/lib/timeAndDate";
import { Progress } from "@/components/ui/progress";

interface PlayerSidebarProps {
  player?: IPlayer;
}

export function PlayerSidebar({ player }: PlayerSidebarProps) {
  // Safe manager data extraction
  const manager = player?.manager;
  const managerName = manager?.fullname || "Not Assigned";

  // Calculate average rating safely
  const ratings = player?.ratings || [];
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((acc, curr) => acc + (curr?.rating || 0), 0) /
        ratings.length
      : 0;

  // Get training team safely
  const trainingTeam = player?.training?.team || "A";

  // Helper functions for safe data access
  const getFormattedDate = (dateString?: string): string => {
    if (!dateString) return "Not Available";
    try {
      return formatDate(dateString);
    } catch {
      return "Invalid Date";
    }
  };

  const getHeightDisplay = (): string => {
    const height = player?.height;
    if (height === undefined || height === null) return "Not Available";
    return `${height} cm`;
  };

  return (
    <div className="space-y-6">
      {/* Personal Details */}
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Personal Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Date of Birth
              </span>
              <div className="flex items-center gap-2">
                <Cake className="h-4 w-4" />
                <span className="font-medium">
                  {getFormattedDate(player?.dob)}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Height</span>
              <span className="font-medium">{getHeightDisplay()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Date Signed</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">
                  {getFormattedDate(player?.dateSigned)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fitness & Health */}
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Current Fitness
              </span>
              <Badge
                variant={
                  player?.fitness == EPlayerFitness.FIT
                    ? "default"
                    : "destructive"
                }
                className="min-w-22.5 justify-center"
              >
                {player?.fitness ?? EPlayerFitness.FIT}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Training Team
              </span>
              <Badge variant="secondary">Team {trainingTeam}</Badge>
            </div>
          </div>

          {(player?.injuries?.length || 0) > 0 && (
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Recent Injuries</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {player?.injuries?.slice(0, 3)?.map((injury, index) => (
                  <Badge
                    key={`injury-${index}`}
                    variant="outline"
                    className="text-xs"
                  >
                    {injury?.title || "Unknown Injury"}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manager Information */}
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Assigned Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <AVATAR
              src={player?.avatar as string}
              alt={manager?.fullname}
              className="h-8 w-8"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold truncate">{managerName}</h4>

              <p className="text-sm text-muted-foreground truncate">
                {manager?.phone || "No phone provided"}
              </p>
            </div>
          </div>

          {!manager && (
            <p className="text-sm text-muted-foreground mt-2 italic">
              No manager assigned to this player
            </p>
          )}
        </CardContent>
      </Card>

      {/* Performance Rating */}
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Average Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="mb-4">
              <Progress
                value={Math.min(averageRating * 10, 100)}
                className="h-2"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {ratings.length || 0} rating
              {ratings.length !== 1 ? "s" : ""}
              {player?.matches?.length && (
                <span className="block text-xs mt-1">
                  ({player.matches.length} matches played)
                </span>
              )}
            </p>
          </div>

          {ratings.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2 text-center italic">
              No ratings available yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
