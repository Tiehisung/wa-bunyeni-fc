 

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AVATAR, Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Share2,
  Printer,
  Edit,
  Mail,
  Phone,
  Award,
  Tag,
} from "lucide-react";
import { EPlayerAvailability, IPlayer } from "@/types/player.interface";
import { EPlayerPosition } from "@/types/player.interface";
import { POPOVER } from "@/components/ui/popover";
import { SocialShare } from "@/components/SocialShare";

interface PlayerHeaderProps {
  player?: IPlayer;
}

export function PlayerHeader({ player }: PlayerHeaderProps) {
  // Early return if no player
  if (!player) {
    return (
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarFallback className="text-lg">NA</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-muted-foreground">
              Player Not Found
            </h1>
          </div>
        </div>
      </div>
    );
  }

  // Safe data extraction with fallbacks
  const firstName = player?.firstName || "Unknown";
  const lastName = player?.lastName || "Player";
  const fullName = `${firstName} ${lastName}`;

  // Safe number display
  const playerNumber = player?.number || "#";

  // Safe contact info
  const email = player?.email || "No email provided";
  const phone = player?.phone || "No phone provided";

  // Status badges
  const isCurrentPlayer = player?.status == "current";

  // Safe captaincy check
  const hasCaptaincy = !!player?.captaincy;
  const captaincyText = player?.captaincy || "Captain";

  // Safe position abbreviation
  const positionAbbreviation = getPositionAbbreviation(player?.position || "");

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
      <div className="flex items-center gap-4">
        <div className="relative">
          <AVATAR
            src={player?.avatar}
            alt={fullName}
          
            size={"2xl"}
          />
          <div className="absolute -top-2 -right-2">
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center text-white font-bold text-sm bg-modalOverlay shadow-md`}
            >
              {playerNumber}
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-bold truncate">{fullName}</h1>
            <Badge
              variant={isCurrentPlayer ? "default" : "destructive"}
              className="shrink-0"
            >
              {isCurrentPlayer}
            </Badge>
          </div>

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <Badge variant="secondary" className="text-sm shrink-0">
              {positionAbbreviation}
            </Badge>

            <Badge variant={"destructive"} className="shrink-0">
              {player?.availability ?? EPlayerAvailability.AVAILABLE}
            </Badge>
            {hasCaptaincy && (
              <Badge
                variant="destructive"
                className="flex items-center gap-1 shrink-0"
              >
                <Award className="h-3 w-3" />
                {captaincyText}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1 min-w-0">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="truncate">{email}</span>
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <Phone className="h-4 w-4 shrink-0" />
              <span className="truncate">{phone}</span>
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <Tag className="h-4 w-4 shrink-0" />
              <span className="truncate">{player?.code}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2 self-start lg:self-center">
        <POPOVER
          trigger={<Share2 className="h-4 w-4" />}
          variant={"outline"}
          className="grid"
        >
          <SocialShare
            title={fullName}
            text={`Check out ${fullName}'s player profile`}
          />
        </POPOVER>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => window.print()}
        >
          <Printer className="h-4 w-4" />
        </Button>
        <Button className="gap-2" size="sm">
          <Edit className="h-4 w-4" />
          Edit Player
        </Button>
      </div>
    </div>
  );
}

export function getPositionAbbreviation(position: EPlayerPosition): string {
  const abbreviationMap: Record<EPlayerPosition, string> = {
    [EPlayerPosition.KEEPER]: "GK",
    [EPlayerPosition.DEFENDER]: "DEF",
    [EPlayerPosition.MIDFILDER]: "MID",
    [EPlayerPosition.FORWARD]: "FWD",
    [EPlayerPosition.STRIKER]: "ST",
    [EPlayerPosition.WING_BACK]: "WB",
    [EPlayerPosition.CENTER_BACK]: "CB",
    [EPlayerPosition.ATTACKING_MIDFIELDER]: "AM",
    [EPlayerPosition.DEFENSIVE_MIDFIELDER]: "DM",
    [EPlayerPosition.WINGER]: "WG",
    [EPlayerPosition.SWEEPER]: "SW",
  };

  return abbreviationMap[position] || position;
}

export function getPositionColor(position: EPlayerPosition): string {
  const colorMap: Record<EPlayerPosition, string> = {
    [EPlayerPosition.KEEPER]: "bg-yellow-100 text-yellow-800 border-yellow-200",
    [EPlayerPosition.DEFENDER]: "bg-blue-100 text-blue-800 border-blue-200",
    [EPlayerPosition.MIDFILDER]: "bg-green-100 text-green-800 border-green-200",
    [EPlayerPosition.FORWARD]: "bg-red-100 text-red-800 border-red-200",
    [EPlayerPosition.STRIKER]:
      "bg-purple-100 text-purple-800 border-purple-200",
    [EPlayerPosition.WING_BACK]:
      "bg-indigo-100 text-indigo-800 border-indigo-200",
    [EPlayerPosition.CENTER_BACK]: "bg-cyan-100 text-cyan-800 border-cyan-200",
    [EPlayerPosition.ATTACKING_MIDFIELDER]:
      "bg-pink-100 text-pink-800 border-pink-200",
    [EPlayerPosition.DEFENSIVE_MIDFIELDER]:
      "bg-emerald-100 text-emerald-800 border-emerald-200",
    [EPlayerPosition.WINGER]: "bg-orange-100 text-orange-800 border-orange-200",
    [EPlayerPosition.SWEEPER]: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return colorMap[position] || "bg-gray-100 text-gray-800 border-gray-200";
}
