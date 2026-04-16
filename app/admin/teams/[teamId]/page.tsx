 
import DataErrorAlert from "@/components/error/DataError";
import { TeamForm } from "../TeamForm";
import { getErrorMessage } from "@/lib/error";
import PageLoader from "@/components/loaders/Page";
import { HeadToHead } from "./HeadToHead";
import { baseApiUrl } from "@/lib/configs";
import { IPageProps } from "@/types";
import { TeamImages } from "./TeamImages";

export const getTeams = async (query?: string) => {
  try {
    const uri = query
      ? `${baseApiUrl}/teams${query}`
      : `${baseApiUrl}/teams`;
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch {
    return [];
  }
};

export const getTeam= async (teamId: string) => {
  try {
    const uri = teamId
      ? `${baseApiUrl}/teams/${teamId}`
      : `${baseApiUrl}/teams`;
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch {
    return [];
  }
};

const TeamPage = async({params}:IPageProps) => {
  const { teamId } = await params;

  const teamData = await getTeam(teamId as string)
 
  if (!teamData?.data)  return <PageLoader />;

  if (!teamData?.success) return <DataErrorAlert message={getErrorMessage(teamData?.message)} />;

  return (
    <div className="pb-12 pt-5">
      <TeamForm team={teamData?.data} />
      <HeadToHead />
      <TeamImages team={teamData?.data} />

    </div>
  );
};

export default TeamPage;
