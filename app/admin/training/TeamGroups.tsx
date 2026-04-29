import { IPlayer } from "@/types/player.interface";
import { AVATAR } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function PreviewTeamGroups({
  teamA,
  teamB,
}: {
  teamA?: IPlayer[];
  teamB?: IPlayer[];
}) {
  return (
    <div>
      <h1 className="font-semibold text-lg md:text-xl text-muted-foreground mb-5 ">
        Teams Preview
      </h1>
      <div className="rounded-2xl border bg-popover flex items-start justify-between gap-6 max-md:flex-col p-3">
        <ul className="p-3 grow ring w-full">
          <li>TEAM A</li>
          {teamA?.map((player) => (
            <li
              key={player?._id}
              className="flex items-center gap-3 my-2 bg-muted/30 p-3 rounded-xl border border-border hover:shadow-md transition"
            >
              <AVATAR
                className="h-12 w-12"
                src={player?.avatar}
                
                alt={`${player.firstName} ${player.lastName}`}
              />

              <div className="flex flex-col">
                <span className="font-semibold text-sm uppercase">
                  {`${player.firstName} ${player.lastName}`}
                </span>
                <Badge variant="outline" className="text-xs mt-1 capitalize">
                  {player?.number}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
        <ul className="p-3 grow ring w-full">
          <li>TEAM B</li>
          {teamB?.map((player) => (
            <li
              key={player?._id}
              className="flex items-center gap-3 my-2 bg-muted/30 p-3 rounded-xl border border-border hover:shadow-md transition"
            >
              <AVATAR
                className="h-12 w-12"
                src={player?.avatar}
                
                alt={`${player.firstName} ${player.lastName}`}
              />

              <div className="flex flex-col">
                <span className="font-semibold text-sm uppercase">
                  {`${player.firstName} ${player.lastName}`}
                </span>
                <Badge variant="outline" className="text-xs mt-1 capitalize">
                  {player?.number}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
