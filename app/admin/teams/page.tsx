"use client";

import DisplayTeams from "./DisplayTeams";
 
import { useGetTeamsQuery } from "@/services/team.endpoints";
import DataErrorAlert from "@/components/error/DataError";
import { getErrorMessage } from "@/lib/error";
import PageLoader from "@/components/loaders/Page";
import { OverlayLoader } from "@/components/loaders/OverlayLoader";

const TeamsPage = () => {
 

  const { data: teams, isLoading, error, isFetching } = useGetTeamsQuery({});

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="space-y-12 p-4 md:px-10 bg-card">
        <DataErrorAlert message={getErrorMessage(error)} />
      </div>
    );
  }

  return (
    <div className="space-y-12 p-4 md:px-10 bg-card">
      <DisplayTeams teams={teams} />

      {isFetching && <OverlayLoader />}
    </div>
  );
};

export default TeamsPage;
