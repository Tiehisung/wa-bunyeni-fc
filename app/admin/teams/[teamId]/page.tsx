"use client";

import DataErrorAlert from "@/components/error/DataError";
import { TeamForm } from "../TeamForm";
import { getErrorMessage } from "@/lib/error";
import PageLoader from "@/components/loaders/Page";
import { useGetTeamByIdQuery } from "@/services/team.endpoints";
 
import { HeadToHead } from "./HeadToHead";
import { useParams } from "next/navigation";

const TeamPage = () => {
  const { teamId } = useParams();

  const {
    data: teamData,
    isLoading: teamsLoading,
    error,
  } = useGetTeamByIdQuery(teamId?.toString() || "");

  if (teamsLoading) {
    return <PageLoader />;
  }

  if (error) {
    return <DataErrorAlert message={getErrorMessage(error)} />;
  }
  return (
    <div className="pb-12 pt-5">
      <TeamForm team={teamData?.data} />
      <HeadToHead />
    </div>
  );
};

export default TeamPage;
