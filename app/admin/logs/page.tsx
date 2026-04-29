import HEADER from "@/components/Element";
import { apiConfig } from "@/lib/configs";
import { LogsClient } from "./Client";
import { IQueryResponse } from "@/types";
import BackToTopButton from "@/components/scroll/ToTopBtn";
import { ILog } from "@/types/log.interface";
import { buildQueryStringServer } from "@/lib/params-server";
 

export const getLogs = async (queryString?: string) => {
  try {
    const url = `${apiConfig.base}/logs${queryString || ""}`;

    const response = await fetch(url, {
      cache: "no-store",
      credentials: "include",
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
};

interface IPageProps {
  searchParams: Promise<{
    displayType: "box" | "list";
    page?: string;
    limit?: string;
    search?: string;
    type?: string;
  }>;
}

export default async function LogsPage({ searchParams }: IPageProps) {
  const qs = buildQueryStringServer(await searchParams);
  const logs = (await getLogs(qs)) as IQueryResponse<ILog[]>;

  return (
    <div className=" ">
      <HEADER title="LOGS" subtitle="Activity Tracking Logs" />

      <LogsClient logs={logs} />

      <BackToTopButton />
    </div>
  );
}
