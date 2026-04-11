import { checkMatchMetrics, checkTeams } from "@/lib/compute/match";
import { AVATAR } from "@/components/ui/avatar";
import { formatDate, formatTimeToAmPm, getTimeAgo } from "@/lib/timeAndDate";
import { Clock } from "lucide-react";
import { IMatch } from "@/types/match.interface";

export const SecondaryFixtureCard = ({
  fixture,
  className,
}: {
  fixture: IMatch;
  className?: string;
}) => {
  const { home, away } = checkTeams(fixture);
  const metrics = checkMatchMetrics(fixture);
  if (fixture?.status == "FT")
    return (
      <main
        className={`_hover rounded-md w-fit grow group _hoverBefore relative _after p-2 ${className}`}
      >
        <div className="flex items-center justify-between gap-2 ">
          <section className="space-y-2 grow ">
            <div className="flex items-center gap-2.5 ">
              <AVATAR
                src={home?.logo as string}
                alt={home?.name as string}
               
                className="h-8 w-8 aspect-square "
              />
              <span className="w-36 line-clamp-1 _label">{home?.name}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <AVATAR
                src={away?.logo as string}
                
                alt={away?.name as string}
                className="h-8 w-8 aspect-square "
              />
              <span className="w-36 line-clamp-1 _label">{away?.name}</span>
            </div>
          </section>

          <section className="flex items-center gap-4">
            <span>FT</span>
            <div className="space-y-1">
              <div className="w-7 h-7 border border-border p-0.5 flex items-center justify-center ">
                {metrics?.goals.home}
              </div>
              <div className="w-7 h-7 border border-border p-0.5 flex items-center justify-center ">
                {metrics?.goals.away}
              </div>
            </div>
          </section>
        </div>
        <div className="flex items-center gap-0.5 text-xs font-thin w-fit ml-auto">
          <Clock className="text-muted-foreground  " size={12} />
          <span>{formatDate(fixture.date, "March 2, 2025")}</span>
          <span>({getTimeAgo(fixture.date)})</span>
        </div>
      </main>
    );

  if (fixture?.status == "UPCOMING")
    return (
      <main
        className={`flex items-center justify-between gap-2 p-2 _hover rounded-md w-fit grow group _hoverBefore relative _after ${className}`}
      >
        <section className="space-y-2 grow ">
          <div className="flex items-center gap-2.5 ">
            <AVATAR
              src={home?.logo as string}
              alt={home?.name as string}
              
              className="h-8 w-8 aspect-square "
            />
            <span className="w-36 line-clamp-1 _label">{home?.name}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <AVATAR
              src={away?.logo as string}
             
              alt={away?.name as string}
              className="h-8 w-8 aspect-square "
            />
            <span className="w-36 line-clamp-1 _label">{away?.name}</span>
          </div>
        </section>

        <section className="flex items-center">
          <div className="grid gap-2 w-24 ">
            <span>{formatTimeToAmPm(fixture.time)}</span>
            <span>{formatDate(fixture.date, "March 2, 2025")}</span>
          </div>
        </section>
      </main>
    );

  return (
    <main
      className={`flex items-center justify-between gap-2 p-2 _hover rounded-md w-fit grow group _hoverBefore relative _after ${className}`}
    >
      <section className="space-y-2 grow ">
        <div className="flex items-center gap-2.5 ">
          <AVATAR
            src={home?.logo as string}
            alt={home?.name as string}
           
            className="h-8 w-8 aspect-square "
          />
          <span className="w-36 line-clamp-1 _label">{home?.name}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <AVATAR
            src={away?.logo as string}
            
            alt={away?.name as string}
            className="h-8 w-8 aspect-square "
          />
          <span className="w-36 line-clamp-1 _label">{away?.name}</span>
        </div>
      </section>

      <section className="space-y-1 text-primaryRed">
        <div className="w-7 h-7 border border-border p-0.5 flex items-center justify-center ">
          3
        </div>
        <div className="w-7 h-7 border border-border p-0.5 flex items-center justify-center ">
          z
        </div>
      </section>
    </main>
  );
};
