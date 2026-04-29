 

 
import { ClearFiltersBtn } from "@/components/buttons/ClearFilters";
import InfiniteLimitScroller from "@/components/InfiniteScroll";
import { PrimarySearch } from "@/components/Search";
import { IAccordionProps, PrimaryAccordion } from "@/components/ui/accordion";
import { shortText } from "@/lib";
import { formatDate, getTimeAgo } from "@/lib/timeAndDate";
import { IQueryResponse } from "@/types";
import { ILog } from "@/types/log.interface";
 
import { IUser } from "@/types/user";

export function LogsClient({ logs }: { logs?: IQueryResponse<ILog[]> }) {
 
  const accordionData = logs?.data?.map((log) => ({
    trigger: (
      <div className="flex justify-between gap-5 items-center grow ">
        <div>
          <p className="font-black ">{shortText(log.title, 50)}</p>
          {log.user && (
            <p className="font-thin italic mt-1.5 text-sm text-muted-foreground">
              ~{shortText(log.user?.name, 20)}
            </p>
          )}
        </div>
        <span className="font-light">
          {getTimeAgo(log.createdAt.toString())}
        </span>
      </div>
    ),
    content: (
      <div className="space-y-2 pb-6 pl-3">
        <p>
          <span className="_label mr-1.5 text-muted-foreground ">
            Description:
          </span>
          {log.description}
        </p>

        <p>
          <span className="_label mr-1.5 text-muted-foreground ">
            Severity:
          </span>
          {log.severity}
        </p>

        <p>
          <span className="_label mr-1.5 text-muted-foreground ">Meta:</span>
          <pre>{log.meta ? JSON.stringify(log.meta, null, 2) : "N/A"}</pre>
        </p>

        <p>
          <span className="_label mr-1.5 text-muted-foreground ">Source:</span>
          {log.source}
        </p>

        <p>
          <span className="_label mr-1.5 text-muted-foreground ">
            Created At:
          </span>
          {formatDate(log.createdAt.toString(), "March 2, 2025")},
          {getTimeAgo(log.createdAt.toString())}
        </p>

        <p>
          <span className="_label mr-1.5 text-muted-foreground ">
            Action By:
          </span>
          {(log?.user as IUser)?.name}
        </p>
      </div>
    ),
    value: log._id,
  }));

  return (
    <div className="_page">
      <header className=" space-y-5 mb-4">
        <div className="text-lg md:text-xl xl:text-3xl font-semibold">
          System Logs
        </div>
        <div className="flex items-center gap-2 justify-between">
          <PrimarySearch
            placeholder="Search Logs"
            inputStyles="h-9"
            className="bg-secondary grow"
            searchKey="log_search"
          />
          <ClearFiltersBtn className="border border-border/45 shadow p-1.5 rounded h-9 " />
        </div>
      </header>

      <PrimaryAccordion
        data={accordionData as IAccordionProps["data"]}
        triggerStyles=" rounded-none"
      />

      <InfiniteLimitScroller pagination={logs?.pagination} />
    </div>
  );
}
