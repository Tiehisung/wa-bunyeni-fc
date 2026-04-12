import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IMatch } from "@/types/match.interface";
import { checkTeams } from "@/lib/compute/match";
import { staticImages } from "@/assets/images";

interface IMatchFixtureCardProps {
  match: IMatch;
  className?: string;
}

export const MatchFixtureCard: React.FC<IMatchFixtureCardProps> = ({
  match,
  className,
}) => {
  const { home, away } = checkTeams(match);
  return (
    <Card className={`w-96 border _borderColor${className}`}>
      {/* Header */}
      <CardHeader className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">{match?.title}</h3>
      </CardHeader>

      {/* Match Details */}
      <div className="flex flex-col items-center text-sm">
        {/* Teams */}
        <CardContent className="flex justify-between items-center w-full mb-2">
          {/* Home Team */}
          <div className="flex flex-col items-center space-y-2">
            <img
              width={250}
              height={250}
              src={home?.logo ?? staticImages.ball}
              alt={"home logo"}
              className="w-12 h-12"
            />
            <span className=" font-medium">{home?.name as string}</span>
          </div>

          {/* Match Time */}
          <div className="flex flex-col items-center space-y-1">
            <span className=" text-gray-500">{match?.date}</span>
            <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-1 font-medium">
              {match?.computed?.result?match.computed.scoreline:match.time}
            </div>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center space-y-2">
            <img
              src={away?.logo ?? staticImages.ball}
              width={250}
              height={250}
              alt={away?.name as string}
              className="w-12 h-12"
            />
            <span className=" font-medium">{away?.name as string}</span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
