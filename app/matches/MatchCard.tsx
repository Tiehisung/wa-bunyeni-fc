import { AVATAR } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {   checkTeams } from "@/lib/compute/match";
import {
  formatDate,
  formatTimeToAmPm,
  getTimeLeftOrAgo,
} from "@/lib/timeAndDate";

import { DIALOG } from "@/components/Dialog";
import { Users } from "lucide-react";

import SquadCard from "../admin/squad/SquadCard";
import { IMatch } from "@/types/match.interface";

export function MatchFixtureCard({ match }: { match?: IMatch }) {
  const { away, home } = checkTeams(match);
  const status = match?.status;

  const score = {
    home: match?.computed?.scoreline?.split("-")?.[0],
    away: match?.computed?.scoreline?.split("-")?.[1],
  };
  return (
    <div className="bg-card border p-4 space-y-2.5">
      <div className="flex justify-between gap-5">
        <Badge
          variant={
            status == "LIVE"
              ? "destructive"
              : status == "FT"
                ? "secondary"
                : "outline"
          }
        >
          {status}
        </Badge>
        <span>
          {formatDate(match?.date, "March 2, 2025")}(
          {getTimeLeftOrAgo(match?.date).formatted})
        </span>
      </div>
      <div className=" flex items-center justify-between">
        <ul>
          <li className="flex items-center gap-1.5 mb-2">
            <AVATAR
              src={home?.logo as string}
              alt={home?.name as string}
              className="h-7 w-7 aspect-square rounded-none"
            />
            <span className="w-36 line-clamp-1">{home?.name}</span>
          </li>
          <li className="flex items-center gap-1.5">
            <AVATAR
              src={away?.logo as string}
              alt={away?.name as string}
              className="h-7 w-7 aspect-square rounded-none"
            />
            <span className="w-36 line-clamp-1">{away?.name}</span>
          </li>
        </ul>

        <div className="font-semibold">
          {status == "FT" ? (
            <div className="grid">
              <span className="px-3 text-lg">{score?.home}</span>
              <span className="px-3 text-lg">{score?.away}</span>
            </div>
          ) : status == "LIVE" ? (
            <span className="text-destructive "> Live</span>
          ) : (
            <span>{formatTimeToAmPm(match?.time as string)}</span>
          )}
        </div>
      </div>
      <hr />
      <div>
        <div className="flex items-center text-sm gap-5">
          {match?.squad && (
            <DIALOG
              trigger={
                <>
                  <Users size={16} />
                  Squad
                </>
              }
              title=""
              className="min-w-[80vw]"
              variant={"ghost"}
            >
              <SquadCard match={match} />
            </DIALOG>
          )}
        </div>
      </div>
    </div>
  );
}
