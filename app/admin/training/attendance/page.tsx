'use client'

import { IPlayerMini } from "@/types/player.interface";
import { AttendanceTable } from "./AttendanceTable";
import { IUser } from "@/types/user";
import { formatDate } from "@/lib/timeAndDate";
import TrainingSessionCard from "./SessionCard";
import { PrimarySearch } from "@/components/Search";
import { AttendanceStandingsTable } from "./AttendanceStandings";
import { PrimaryTabs } from "@/components/Tabs";
import HEADER from "@/components/Element";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PrimaryAccordion } from "@/components/ui/accordion";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import { useGetTrainingSessionsQuery } from "@/services/training.endpoints";
import { useSearchParams } from "next/navigation";

export interface ITrainingSession {
  date: string;
  location: string;
  _id: string;
  note: string;
  recordedBy: IUser;
  attendance: {
    allPlayers: Array<IPlayerMini>;
    attendedBy: Array<IPlayerMini>;
  };
  updateCount: number;
  createdAt?: string;
  updatedAt?: string;
}

const AttendancePage = () => {
  const  searchParams  = useSearchParams();
  const paramsString = searchParams.toString();

  const {
    data: playersData,
    isLoading: playersLoading,
    error: playersError,
  } = useGetPlayersQuery(paramsString);

  const {
    data: trainingSessionsData,
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useGetTrainingSessionsQuery();

  const isLoading = playersLoading || sessionsLoading;
  const hasError = playersError || sessionsError;

  const players = playersData;
  const trainingSessions = trainingSessionsData;

  const accordion = trainingSessions?.data?.map((tSession) => ({
    trigger: (
      <div className="grid items-center gap-1">
        <p>
          <span>{tSession?.location}</span> -
          <span>
            {formatDate(tSession.createdAt, "March 2, 2025")},{" "}
            {tSession?.createdAt?.split("T")?.[1]?.substring(0, 5)}
          </span>
        </p>
        <p className="font-extralight">~~ {tSession?.recordedBy?.name}</p>
      </div>
    ),
    content: <TrainingSessionCard trainingSession={tSession} />,
    value: tSession._id ?? "",
  }));

  if (isLoading) {
    return (
      <div>
        <HEADER title="Training Attendance" />
        <main className="_page px-3 mt-6 flex justify-center items-center min-h-100">
          <Loader message="Loading attendance data..." />
        </main>
      </div>
    );
  }

  if (hasError) {
    return (
      <div>
        <HEADER title="Training Attendance" />
        <main className="_page px-3 mt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load data. Please try again.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div>
      <HEADER title="Training Attendance" />
      <main className="_page px-3 mt-6">
        <PrimaryTabs
          tabs={[
            { label: "Standings", value: "standings" },
            { label: "Record Attendance", value: "table" },
            { label: "View Passed", value: "passed" },
          ]}
          defaultValue="standings"
        >
          <AttendanceStandingsTable trainingSessions={trainingSessions?.data} />

          <AttendanceTable
            players={players?.data}
            trainingSessions={trainingSessions?.data}
          />

          <div className="mt-12 space-y-6">
            <PrimarySearch
              className="bg-popover"
              inputStyles="h-9"
              placeholder="Search Session"
              searchKey="training_search"
            />
            <PrimaryAccordion
              data={accordion ?? []}
              className=""
              triggerStyles="cursor-pointer border-b"
            />
          </div>
        </PrimaryTabs>
      </main>
    </div>
  );
};

export default AttendancePage;
