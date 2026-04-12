 

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Target, Shield, Zap, MapPin, TrendingUp } from "lucide-react";
import { getPositionAbbreviation, getPositionColor } from "./Header";
import { EPlayerPosition, IPlayer } from "@/types/player.interface";

interface PositionVisualizationProps {
  player?: IPlayer;
}

export function PositionVisualization({ player }: PositionVisualizationProps) {
  // Get field position coordinates
  const getFieldPosition = (position: EPlayerPosition) => {
    const positions = {
      [EPlayerPosition.KEEPER]: { top: "85%", left: "50%" },
      [EPlayerPosition.DEFENDER]: { top: "72%", left: "35%" },
      [EPlayerPosition.CENTER_BACK]: { top: "72%", left: "50%" },
      [EPlayerPosition.WING_BACK]: { top: "65%", left: "15%" },
      [EPlayerPosition.SWEEPER]: { top: "78%", left: "50%" },
      [EPlayerPosition.MIDFILDER]: { top: "52%", left: "50%" },
      [EPlayerPosition.DEFENSIVE_MIDFIELDER]: { top: "62%", left: "50%" },
      [EPlayerPosition.ATTACKING_MIDFIELDER]: { top: "42%", left: "50%" },
      [EPlayerPosition.FORWARD]: { top: "32%", left: "50%" },
      [EPlayerPosition.STRIKER]: { top: "25%", left: "50%" },
      [EPlayerPosition.WINGER]: { top: "38%", left: "15%" },
    };

    return positions[position] || { top: "50%", left: "50%" };
  };

  // Get position category
  const getPositionCategory = (): string => {
    const position = player?.position;

    if (position === EPlayerPosition.KEEPER) return "Goalkeeper";

    if (
      [
        EPlayerPosition.DEFENDER,
        EPlayerPosition.CENTER_BACK,
        EPlayerPosition.WING_BACK,
        EPlayerPosition.SWEEPER,
      ].includes(position as EPlayerPosition)
    )
      return "Defense";

    if (
      [
        EPlayerPosition.MIDFILDER,
        EPlayerPosition.ATTACKING_MIDFIELDER,
        EPlayerPosition.DEFENSIVE_MIDFIELDER,
        EPlayerPosition.WINGER,
      ].includes(position as EPlayerPosition)
    )
      return "Midfield";

    return "Attack";
  };

  const fieldPos = getFieldPosition(player?.position as EPlayerPosition);
  const positionClass = getPositionColor(player?.position as EPlayerPosition);
  const category = getPositionCategory();

  // Get category icon
  const getCategoryIcon = () => {
    switch (category) {
      case "Goalkeeper":
        return <Shield className="h-4 w-4 text-yellow-500" />;
      case "Defense":
        return <Shield className="h-4 w-4 text-blue-500" />;
      case "Midfield":
        return <Zap className="h-4 w-4 text-green-500" />;
      default:
        return <Target className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5" />
          Position on Field
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Field */}
        <div className="relative h-48 w-full bg-green-600 rounded-lg overflow-hidden">
          <div className="absolute inset-0 border-4 border-white/80">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 border-2 border-white/80 rounded-full" />
            <div className="absolute top-0 left-1/2 h-full w-0.5 bg-white/80" />
            <div className="absolute bottom-0 left-1/4 h-12 w-1/2 border-2 border-white/80" />
            <div className="absolute top-0 left-1/4 h-12 w-1/2 border-2 border-white/80" />
          </div>

          {/* Player dot */}
          <div
            className={`absolute ${positionClass} w-8 h-8 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-lg`}
            style={{ top: fieldPos.top, left: fieldPos.left }}
          >
            <Target className="h-4 w-4" />
          </div>

          {/* Position label */}
          <div
            className="absolute bg-black/80 text-white text-xs px-2 py-1 rounded -translate-x-1/2"
            style={{ top: `calc(${fieldPos.top} + 20px)`, left: fieldPos.left }}
          >
            {getPositionAbbreviation(player?.position as EPlayerPosition)}
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4">
          <InfoBlock icon={<MapPin className="h-4 w-4" />} label="Position">
            <div
              className={`${positionClass} px-3 py-2 rounded-lg font-medium`}
            >
              {player?.position}
            </div>
          </InfoBlock>

          <InfoBlock icon={getCategoryIcon()} label="Category">
            <div className="bg-gray-100 px-3 py-2 rounded-lg font-medium">
              {category}
            </div>
          </InfoBlock>

          <InfoBlock label="Number">
            <div className="bg-gray-100 px-3 py-2 rounded-lg font-bold text-center">
              #{player?.number}
            </div>
          </InfoBlock>

          <InfoBlock
            icon={<TrendingUp className="h-4 w-4" />}
            label="Training Team"
          >
            <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg font-medium text-center">
              Team {player?.training.team || "A"}
            </div>
          </InfoBlock>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoBlock({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}
