import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IMatch } from "@/types/match.interface";
import { checkTeams } from "@/lib/compute/match";
import { staticImages } from "@/assets/images";

export const CanceledMatchCard: React.FC<{
  match: IMatch;
  league: string;
  className?: string;
}> = ({ league, match, className }) => {
  const { home, away } = checkTeams(match);

  return (
    <Card className={"w-80  border rounded-lg p-4 " + className}>
      {/* Header */}
      <CardHeader className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-red-600">Match Canceled</h3>
        <span className="text-sm text-gray-50">{league}</span>
      </CardHeader>

      {/* Teams */}
      <CardContent className="flex justify-between items-center mb-4">
        {/* Home Team */}
        <div className="flex flex-col items-center space-y-2">
          <img
            width={100}
            height={100}
            src={home?.logo ?? staticImages.ball}
            alt={home?.name ?? "home"}
            className="w-12 h-12"
          />
          <span className="text-sm font-medium">{home?.name}</span>
        </div>

        {/* Versus */}
        <span className="text-gray-50 font-medium">vs</span>

        {/* Away Team */}
        <div className="flex flex-col items-center space-y-2">
          <img
            width={100}
            height={100}
            src={away?.logo ?? staticImages.ball}
            alt={away?.name}
            className="w-12 h-12"
          />
          <span className="text-sm font-medium">{away?.name}</span>
        </div>
      </CardContent>
    </Card>
  );
};
