"use client";

import { AVATAR } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { checkMatchMetrics, checkTeams } from "@/lib/compute/match";
import {
  formatDate,
  formatTimeToAmPm,
  getTimeLeftOrAgo,
} from "@/lib/timeAndDate";
import { DIALOG } from "@/components/Dialog";
import SquadCard from "../squad/SquadCard";
import SquadForm from "../squad/SquadForm";
import { IMatch } from "@/types/match.interface";
import { ResizableContent } from "@/components/resizables/ResizableContent";
 
import { MatchForm } from "./FixtureForm";
import { StackModal } from "@/components/modals/StackModal";
import Link from "next/link";

interface Props {
  match?: IMatch;
}
export function AdminMatchCard({ match }: Props) {
  const { away, home } = checkTeams(match);
  const scores = checkMatchMetrics(match);
  const status = match?.status;

  return (
    <div className="bg-card border p-4 space-y-2.5 max-w-[90vw]">
      <header className="flex justify-between gap-5">
        <Badge
          variant={
            status === "LIVE"
              ? "destructive"
              : status === "FT"
                ? "secondary"
                : "outline"
          }
        >
          {status}
        </Badge>
        <div className="text-sm text-muted-foreground">
          {formatDate(match?.date, "March 2, 2025")}(
          {getTimeLeftOrAgo(match?.date).formatted})
        </div>
      </header>

      <main className="flex items-center justify-between">
        <ul>
          <li className="flex items-center gap-1.5 mb-2">
            <AVATAR
              src={home?.logo as string}
              alt={home?.name as string}
              className="h-7 w-7 aspect-square rounded-none"
            />
            <span className="line-clamp-1">{home?.name}</span>
          </li>
          <li className="flex items-center gap-1.5">
            <AVATAR
              src={away?.logo as string}
              alt={away?.name as string}
              className="h-7 w-7 aspect-square rounded-none"
            />
            <span className="line-clamp-1">{away?.name}</span>
          </li>
        </ul>

        <div className="font-semibold">
          {status === "FT" ? (
            <div className="grid">
              <span className="px-3 text-lg">{scores?.goals?.home}</span>
              <span className="px-3 text-lg">{scores?.goals?.away}</span>
            </div>
          ) : status === "LIVE" ? (
            <span className="text-destructive">Live</span>
          ) : (
            <span>{formatTimeToAmPm(match?.time as string)}</span>
          )}
        </div>
      </main>

      <hr />

      <ResizableContent className="max-w-full text-sm">
        <StackModal
          trigger={"Edit"}
          id={`edit-m-${match?._id}`}
          variant={"ghost"}
        >
          <MatchForm fixture={match} />
        </StackModal>

        {match?.squad ? (
          <DIALOG
            trigger="Squad"
            triggerStyles="justify-start"
            title=""
            className="min-w-[80vw]"
            variant={"ghost"}
          >
            <SquadCard match={match} />
          </DIALOG>
        ) : (
          <DIALOG
            trigger="Squad"
            variant="ghost"
            triggerStyles="justify-start"
            title={` Squad for ${match?.title}`}
            className="min-w-[80vw]"
          >
            <SquadForm defaultMatch={match} />
          </DIALOG>
        )}

        <Link
          href={`/admin/matches/${match?.slug ?? match?._id}`}
          className="_hover _link p-2 px-4"
        >
          View
        </Link>
      </ResizableContent>
    </div>
  );
}
