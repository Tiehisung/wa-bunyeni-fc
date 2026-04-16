'use client'
 
import DataErrorAlert from "@/components/error/DataError";
import { TeamForm } from "../TeamForm";
import PageLoader from "@/components/loaders/Page";
import { HeadToHead } from "./HeadToHead";
import { TeamImages } from "./TeamImages";
import { useParams } from "next/navigation";
import { useGetTeamByIdQuery } from "@/services/team.endpoints";

// export const getTeams = async (query?: string) => {
//   try {
//     const uri = query
//       ? `${baseApiUrl}/teams${query}`
//       : `${baseApiUrl}/teams`;
//     const response = await fetch(uri);
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     return await response.json();
//   } catch {
//     return [];
//   }
// };

// export const getTeam= async (teamId: string) => {
//   try {
//     const uri = teamId
//       ? `${baseApiUrl}/teams/${teamId}`
//       : `${baseApiUrl}/teams`;
//     const response = await fetch(uri);
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     return await response.json();
//   } catch {
//     return [];
//   }
// };

const TeamPage =  ( ) => {
  const { teamId } =   useParams();

  const { data: teamData, isLoading, error, } = useGetTeamByIdQuery(teamId as string);
 
  if (isLoading) return <PageLoader />;

  if (error)
    return <DataErrorAlert message={error} />;

  return (
    <div className="pb-12 pt-5">
      <HeadToHead />
      <TeamForm team={teamData?.data} />
      <TeamImages team={teamData?.data} />
    </div>
  );
};

export default TeamPage;
