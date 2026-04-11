"use client";

import ChangePlayerTeam from "./ChangeTeam";
import { PreviewTeamGroups } from "./TeamGroups";
import { AVATAR } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Header from "../../../components/Element";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import Loader from "@/components/loaders/Loader";
 import DataErrorAlert from "@/components/error/DataError";

export default function TrainingSettingsAdm() {
  const { data: playersData, isLoading, error } = useGetPlayersQuery("");

  const players = playersData;

  const teamA = players?.data?.filter(
    (p) => p.training?.team?.toLowerCase() === "a",
  );
  const teamB = players?.data?.filter(
    (p) => p.training?.team?.toLowerCase() === "b",
  );

  if (isLoading) {
    return (
      <main className="grid px-1 _page">
        <Header title="Manage Training with Teams" />
        <div className="flex justify-center items-center min-h-100">
          <Loader message="Loading players..." />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="grid px-1 _page">
        <Header title="Manage Training with Teams" />
        <div className="p-4">
           <DataErrorAlert message={error} />
        </div>
      </main> 
    );
  }

  return (
    <main className="grid px-1 _page">
      <Header title="Manage Training with Teams" />
      <div className="rounded-2xl p-2 md:p-3 mb-20 overflow-x-auto">
        <Table>
          <TableCaption>Training Teaming</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>PLAYER</TableHead>
              <TableHead className="grid grid-cols-2 items-center justify-center">
                <span>Team A</span> <span>Team B</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players?.data?.map((player) => (
              <TableRow className="shadow" key={player?._id}>
                <TableCell className="flex items-center gap-4 uppercase">
                  <AVATAR
                    className="h-12 w-12"
                    src={player?.avatar}
                    alt={`${player.firstName} ${player.lastName}`}
                  />
                  <span>
                    {`${player.firstName} ${player.lastName} (${player.number})`}
                  </span>
                </TableCell>

                <TableCell className="min-w-24">
                  <ChangePlayerTeam player={player} />
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell>Total: {players?.data?.length || 0}</TableCell>
              <TableCell className="grid grid-cols-2">
                <span>Team A: {teamA?.length ?? 0}</span>
                <span>Team B: {teamB?.length ?? 0}</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <PreviewTeamGroups teamA={teamA} teamB={teamB} />
    </main>
  );
}
