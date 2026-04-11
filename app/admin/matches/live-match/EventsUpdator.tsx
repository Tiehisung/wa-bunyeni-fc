"use client";

import { TABS } from "@/components/ui/tabs";
import { GeneralEventsTab } from "./(events)/General";
import { ScoreEventsTab } from "./(events)/Goals";
import { Button } from "@/components/buttons/Button";
import { Trash2, Bandage, Info, Crown } from "lucide-react";

import { IMatch, IMatchEvent, ITeam } from "@/types/match.interface";
import { CardForm } from "../../cards/CardForm";
import { InjuryForm } from "../../injuries/InjuryForm";
import { MVPForm } from "../mvps/MvpForm";
import { Separator } from "@/components/ui/separator";
import { smartToast } from "@/utils/toast";
import { useUpdateMatchMutation } from "@/services/match.endpoints";
import { useAuth } from "@/store/hooks/useAuth";
import { getDeadlineInfo } from "@/lib/timeAndDate";

interface IProps {
  opponent?: ITeam;
  match: IMatch;
}
export function MatchEventsAdmin({ opponent, match }: IProps) {
  const { user } = useAuth();
  const sortedEvents = match?.events
    ? [...match.events].sort(
        (a, b) => Number(b.minute ?? 0) - Number(a.minute ?? 0),
      )
    : [];

  const tabs = [
    {
      label: "General",
      value: "general",
      icon: <Info className="h-5 w-5 text-blue-500" />,
    },
    {
      label: "⚽ Goal",
      value: " Goal",
    },
    {
      label: "🟨🟥 Card",
      value: " Card",
    },
    {
      label: " Injury",
      value: " injury",
      icon: <Bandage className="h-5 w-5 text-red-500" />,
    },
    {
      label: " MoTM",
      value: " motm",
      icon: <Crown className="h-5 w-5 text-red-500" />,
    },
  ];

  const isLocked =
    user?.role !== "super_admin" &&
    getDeadlineInfo(match?.date as string, 3).isPassed;

  return (
    <div>
      <h1 className="_label my-3">EVENTS LOGGER</h1>

      {isLocked ? (
        <div>
          Match is closed for updates since{" "}
          {getDeadlineInfo(match?.date as string, 3).deadline}
        </div>
      ) : (
        <TABS
          tabs={tabs}
          listClassName="flex w-full overflow-x-auto h-12 rounded-none"
          triggerClassName={` whitespace-nowrap data-[state=active]:border-primary data-[state=active]:text-primary rounded-none`}
          className="border"
        >
          <GeneralEventsTab match={match} />

          <ScoreEventsTab opponent={opponent} match={match} />

          <CardForm match={match} />

          <InjuryForm match={match} />
          <MVPForm match={match} />
        </TABS>
      )}

      <Separator className="my-4" />

      <div className="mt-6 ">
        <h1 className="_label mb-3"> EVENTS</h1>
        {sortedEvents.map((event, index) => (
          <MatchEventCard event={event} key={index} match={match} />
        ))}
      </div>
    </div>
  );
}

function MatchEventCard({
  match,
  event,
}: {
  match: IMatch;
  event: IMatchEvent;
}) {
  const [updateMatch, { isLoading }] = useUpdateMatchMutation();

  const onDelete = async () => {
    try {
      const result = await updateMatch({
        _id: match?._id,
        events: match?.events?.filter(
          (e) => e.description !== event.description,
        ),
      });

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };
  return (
    <div className="flex items-start gap-4 rounded-lg bg-muted p-4">
      <span className="text-xl font-semibold p-1 ">{event?.minute}</span>
      <div className="grow pb-4 border-b border-border/70">
        <p className="font-semibold">{event?.title}</p>

        <p className="text-xs text-muted-foreground ">{event?.description}</p>
      </div>

      <Button
        waiting={isLoading}
        waitingText=""
        onClick={onDelete}
        className="ml-auto"
        variant={"ghost"}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
