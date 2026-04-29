 
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Activity, Heart, Shield } from "lucide-react";
import { IPlayer } from "@/types/player.interface";
import { EInjurySeverity } from "@/types/injury.interface";
import { TABS } from "@/components/ui/tabs";

interface InjuryAndIssuesProps {
  player?: IPlayer;
}

export function PlayerInjuryAndIssues({ player }: InjuryAndIssuesProps) {
  const recentInjuries = player?.injuries?.slice(0, 5) ?? [];
  const currentIssues = player?.issues ?? [];

  return (
    <div className="">
      <TABS
        tabs={[
          {
            label: "Current Issues",
            value: "Current Issues",
            icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          },
          {
            label: " Injury History",
            value: " Injury History",
            icon: <Activity className="h-5 w-5 text-red-500" />,
          },
        ]}
        listClassName="grid-cols-2 md:grid-cols-4"
      >
        {/* Current Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Current Issues
            </CardTitle>
            <CardDescription>
              Performance, Ratings, Suggestions and others
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentIssues.length > 0 ? (
              <div className="space-y-3">
                {currentIssues.map((issue, index) => (
                  <div key={index} className=" p-3 bg-accent rounded-lg">
                    <p className="text-sm">{issue?.title ?? "Unknown"}</p>
                    {issue?.description && <p>{issue.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No current issues reported</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Injury History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-500" />
              Injury History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentInjuries.length > 0 ? (
              <div className="space-y-3">
                {recentInjuries.map((injury, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-start p-3 bg-red-50 rounded-lg"
                  >
                    <p className="text-sm">{injury?.title}</p>
                    {injury?.description && <p>{injury.description}</p>}
                    <Badge
                      variant={
                        injury.severity == EInjurySeverity.SEVERE
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {injury.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No injury history</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TABS>
    </div>
  );
}
