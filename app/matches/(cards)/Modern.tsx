"use client";

import { Badge } from "@/components/ui/badge";
import { checkTeams } from "@/lib/compute/match";
import { formatDate } from "@/lib/timeAndDate";
import { IMatch } from "@/types/match.interface";
import Link from "next/link";

interface Props {
  match?: IMatch;
}
const ModernFixtureCard = ({ match }: Props) => {
  const { home, away, } = checkTeams(match);
  return (
    <div className="bg-card rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 hover:shadow-lg transition-shadow border border-muted">
      <div className="flex items-center gap-4 w-full md:w-auto ">
        <div className="min-w-25">
          <span className="text-card-foreground text-sm font-medium">
            {formatDate(match?.date, "MAR 28, 2025")}
          </span>
          <span className="text-gray-400 text-xs block">
            {match?.competition || "Friendly"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-left border-l-2 border-primary/30 pl-2">
          <span className="font-semibold text-">{home?.name}</span>
          <span className="text-primary font-bold text-lg">vs</span>
          <span className="font-semibold text-">{away?.name}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
        {match?.computed ? (
          <Badge
            variant={"secondary"}
            className=" px-4 py-1 rounded-full text-sm font-bold"
          >
            {match?.computed.teamScore} - {match?.computed.opponentScore}{" "}
            {match?.computed?.result === "win"
              ? "🏆"
              : match?.computed?.result === "loss"
                ? "😞"
                : "🤝"}
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className=" px-4 py-1 rounded-full text-sm font-semibold"
          >
            ⏱️ {match?.time}
          </Badge>
        )}
        <Link
          href={
            match?.computed?.result
              ? `/highlights?tag=${match?._id}`
              : "/donation"
          }
          className="text-primary hover:text-secondary text-sm font-medium transition-colors"
        >
          {match?.computed?.result ? "📺 Highlights →" : "🎫 Support Match →"}
        </Link>
      </div>
    </div>
  );
};

export default ModernFixtureCard;
