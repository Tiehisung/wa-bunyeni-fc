"use client";

import { formatDate } from "@/lib/timeAndDate";
import { IQueryResponse } from "@/types";
import { PrimaryDropdown } from "@/components/Dropdown";
import { LVOutPutTable } from "@/components/tables/VerticalTable";
import { Edit, Plus, Trash } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { StackModal } from "@/components/modals/StackModal";

import { useDeleteTeamMutation } from "@/services/team.endpoints";
import { ITeam } from "@/types/match.interface";
import { TeamForm } from "./TeamForm";
import { Pagination } from "@/components/pagination/Pagination";
import { Button } from "@/components/buttons/Button";
 
import { smartToast } from "@/utils/toast";
import { getErrorMessage } from "@/lib/error";
import { useRouter } from "next/navigation";

const DisplayTeams = ({ teams }: { teams?: IQueryResponse<ITeam[]> }) => {
  const router = useRouter();
  const [deleteTeam] = useDeleteTeamMutation();

  if (!teams) return <div className="_label p-6">No teams available</div>;

  const handleDelete = async (teamId: string) => {
    try {
      const result = await deleteTeam(teamId).unwrap();

      smartToast(result);
    } catch (error) {
      smartToast({ error: getErrorMessage(error, "Failed to delete team") });
    }
  };

  return (
    <div className="mx-auto">
      <header className="text-muted-foreground flex items-center justify-between gap-6">
        <span className="_heading">Teams</span>
        <StackModal
          trigger={
            <>
              <Plus />
              New
            </>
          }
          triggerStyles="justify-start"
          variant="default"
          id="new-team"
          closeOnEsc
        >
          <TeamForm />
        </StackModal>
      </header>

      <ul className="divide-y-8 divide-border space-y-14">
        {teams?.data?.map((team) => (
          <li key={team?._id} className="relative pb-6 px-4">
            <p className="_heading">{team?.name}</p>
            <div className="flex flex-wrap gap-3.5">
              <img
                src={team?.logo}
                alt={team?.name ?? "logo"}
                className="object-cover h-60 w-60 aspect-4/3 rounded-xl"
              />

              <div className="grow">
                <LVOutPutTable
                  body={[
                    { label: "Alias", value: team?.alias },
                    {
                      label: "Last Match",
                      value: formatDate(team?.updatedAt, "March 2, 2025"),
                    },
                    { label: "Encounters", value: "0" },
                    { label: "Wins", value: "0" },
                    { label: "Losses", value: "0" },
                    { label: "Draws", value: "0" },
                  ]}
                  trStyles="w-full"
                  valueTDStyles="w-full"
                  className="rounded-xl overflow-hidden border shadow-2xs"
                />
              </div>
            </div>
            <PrimaryDropdown
              triggerStyles="absolute right-4 top-1 bg-accent/40 rounded-full h-10 w-10 _hover flex items-center justify-center"
              className="py-4 px-2"
            >
              <Button
                variant={"ghost"}
                className="w-full flex justify-start"
                onClick={() => router.push(`/admin/teams/${team._id}`)}
              >
                <Edit />
                Go to team
              </Button>
              <ConfirmDialog
                onConfirm={() => handleDelete(team._id)}
                trigger={
                  <>
                    <Trash />
                    Delete
                  </>
                }
                triggerStyles="text-sm p-1.5 px-2 grow w-full justify-start"
                variant="ghost"
                title={`Delete '${team?.name}'`}
                description={`Are you sure you want to delete "${team?.name}"?`}
              />
            </PrimaryDropdown>
          </li>
        ))}

        {teams?.data?.length === 0 && <li>No teams available.</li>}
      </ul>

      <Pagination pagination={teams?.pagination} />
    </div>
  );
};

export default DisplayTeams;
