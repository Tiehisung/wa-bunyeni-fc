import { getTimeAgo } from "@/lib/timeAndDate";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IMatch } from "@/types/match.interface";
import { checkTeams } from "@/lib/compute/match";
import { staticImages } from "@/assets/images";

export const PlayedMatchCard: React.FC<{
  match: IMatch;
  league: string;
  className?: string;
}> = ({ league, match, className }) => {
  const { home, away } = checkTeams(match);
  const teams = [home, away];

  return (
    <Card
      className={`min-w-80  border  rounded-lg shadow-md p-4 text-sm ${className}`}
    >
      {/* Header */}
      <CardHeader className={`flex justify-between text-sm mb-4`}>
        <Badge className={`  `} variant={"outline"}>
          FT({getTimeAgo(match.date)})
        </Badge>
        <span>{league}</span>
      </CardHeader>

      {/* Teams */}
      {teams?.map((team, index) => (
        <div
          key={index}
          className={`flex justify-between items-center ${
            index === 0 ? "mb-4" : ""
          }`}
        >
          {/* Team Details */}
          <div className="flex items-center space-x-3">
            <img
              src={team?.logo ?? staticImages.ball}
              alt={team?.name ?? ""}
              className="w-8 h-8 rounded-full"
              width={400}
              height={400}
            />
            <span className="  font-medium">{team?.name}</span>
          </div>

          {/* Team Score */}
          {/* <span className="text-xl font-bold">{match.computed?.}</span> */}
        </div>
      ))}
    </Card>
  );
};
