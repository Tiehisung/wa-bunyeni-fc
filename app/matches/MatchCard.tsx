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
import SquadCard from "../admin/squad/SquadCard";
import { IMatch } from "@/types/match.interface";
import { Button } from "@/components/buttons/Button";
import { useRouter } from "next/navigation";
import { GiDarkSquad } from "react-icons/gi";
import { GlassmorphicGradient } from "@/components/Glasmorphic/Gradient";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function MatchFixtureCard({ match }: { match?: IMatch }) {
  const router = useRouter();
  const { away, home } = checkTeams(match);
  const metrics = checkMatchMetrics(match);
  const status = match?.status;

  return (
    <GlassmorphicGradient className=" p-4 space-y-2.5">
      <header className="flex justify-between gap-5 font-light text-sm">
        <Badge
          variant={
            status == "LIVE"
              ? "destructive"
              : status == "FT"
                ? "secondary"
                : "outline"
          }
          className=" font-light text-sm"
        >
          {status}
        </Badge>

        <Badge
          className="uppercase font-light text-sm"
          variant={match?.category == "u13" ? "secondary" : "outline"}
        >
          {match?.category}
        </Badge>

        <span>
          {formatDate(match?.date, "March 2, 2025")}(
          {getTimeLeftOrAgo(match?.date).formatted})
        </span>
      </header>
      <Link href={`/matches/${match?.slug || match?._id}`}>
        <div className="cursor-pointer">{/* Link content */}</div>
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
                <span className="px-3 text-lg">{metrics?.goals?.home}</span>
                <span className="px-3 text-lg">{metrics?.goals?.away}</span>
              </div>
            ) : status == "LIVE" ? (
              <span className="text-destructive "> Live</span>
            ) : (
              <span>{formatTimeToAmPm(match?.time as string)}</span>
            )}
          </div>
        </div>{" "}
      </Link>

      <Separator className="mt-1.5" />

      <footer className="flex items-center justify-between text-sm gap-5">
        {match?.squad && (
          <DIALOG
            trigger={<GiDarkSquad />}
            title=""
            className="min-w-[80vw]"
            variant={"ghost"}
          >
            <SquadCard match={match} />
          </DIALOG>
        )}

        <Button
          onClick={() => router.push(`/matches/${match?.slug || match?._id}`)}
          primaryText=""
          variant="ghost"
          className="rounded-full px-4 font-light text-sm"
        >
          Details
        </Button>
      </footer>
    </GlassmorphicGradient>
  );
}
