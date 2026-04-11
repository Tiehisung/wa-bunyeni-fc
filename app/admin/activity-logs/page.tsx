"use client";

import HEADER from "@/components/Element";

import { LogsClient } from "./Client";
import BackToTopButton from "@/components/scroll/ToTopBtn";

 
import { useGetLogsQuery } from "@/services/logs.endpoints";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";

export default function LogsPage() {
  const searchParams  = useSearchParams();
  const paramsString = searchParams.toString();
  console.log(paramsString);

  const { data: logsData, isLoading, error } = useGetLogsQuery({});
  const logs = logsData;

  if (isLoading) {
    return (
      <div className="_page">
        <HEADER title="LOGS" subtitle="Activity Tracking Logs" />
        <div className="flex justify-center items-center min-h-100">
          <Loader message="Loading logs..." />
        </div>
        <BackToTopButton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="_page">
        <HEADER title="LOGS" subtitle="Activity Tracking Logs" />
        <div className="p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load logs. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
        <BackToTopButton />
      </div>
    );
  }

  return (
    <div className="_page">
      <HEADER title="LOGS" subtitle="Activity Tracking Logs" />
      <LogsClient logs={logs} />
      <BackToTopButton />
    </div>
  );
}
