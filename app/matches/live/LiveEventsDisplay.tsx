import { IMatch } from "@/types/match.interface";


export async function LiveMatchEvents({ match }: { match?: IMatch }) {
  const sortedEvents = match?.events
    ? [...match?.events]?.sort(
        (a, b) => Number(b.minute ?? 0) - Number(a.minute ?? 0)
      )
    : [];
  if (!match)
    return <div className="p-6 _label text-center">No Live Match Yet </div>;
  return (
    <div className="pt-4 container">
      <div className="mt-6 ">
        <h1 className="_label mb-3">LIVE EVENTS</h1>
        {sortedEvents.map((event, index) => (
          <div
            className="flex items-start gap-4 rounded-lg bg-muted p-4"
            key={index}
          >
            <span className="text-xl font-semibold p-1 ">{event?.minute}</span>
            <div className="grow pb-4 border-b border-border/70">
              <p className="font-semibold">{event?.title}</p>

              <p className="text-xs text-muted-foreground ">
                {event?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
