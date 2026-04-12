 "use client";



 import { IPlayerMini } from "@/types/player.interface";
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
import { getInitials } from "@/lib";
import { ITrainingSession } from "./page";
import { IUser } from "@/types/user";
import { computeAttendanceStandings } from ".";

export interface IPostTrainingSession {
  date: string;
  location: string;
  note?: string;
  recordedBy?: Partial<IUser>;
  attendance: {
    allPlayers: Array<IPlayerMini>;
    attendedBy: Array<IPlayerMini>;
  };
}

interface IProps {
  trainingSessions?: ITrainingSession[];
}

export function AttendanceStandingsTable({ trainingSessions }: IProps) {
  const standings = computeAttendanceStandings(
    trainingSessions as ITrainingSession[]
  );
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mt-6">Training Attendance</h2>

      <Table>
        <TableCaption>Training Attendance List</TableCaption>

        <TableHeader className="uppercase text-lg md:text-xl">
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead className="text-center" title="Percentage">
              P
            </TableHead>
            <TableHead className="text-center" title="Attendance">
              A
            </TableHead>
            <TableHead className="text-center" title="Total">
              T
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {standings.map((player, i) => {
            return (
              <TableRow key={player._id}>
                <TableCell className="flex items-center gap-2.5 font-medium uppercase">
                  <span className="text-xs text-muted-foreground">{i + 1}</span>
                  <AVATAR
                    src={player?.avatar as string}
                    alt={getInitials(player?.name)}
                  />
                  <span>
                    {player?.name}({player.number})
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {player?.attendancePercentage}
                </TableCell>
                <TableCell className="text-center">
                  {player?.attendedCount}
                </TableCell>
                <TableCell className="text-center">
                  {player?.totalSessions}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
