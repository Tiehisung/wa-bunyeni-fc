"use client";

import { IPlayer, IPlayerMini } from "@/types/player.interface";
import { Button } from "@/components/buttons/Button";
import { AVATAR } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/lib";
import { ITrainingSession } from "./page";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { isToday } from "@/lib/timeAndDate";
import { toast } from "sonner";
import ContentShowcaseWrapper from "@/components/ShowcaseWrapper";
import { Label } from "@/components/ui/label";
import {
  useCreateTrainingSessionMutation,
  useUpdateTrainingSessionMutation,
} from "@/services/training.endpoints";
import { staticImages } from "@/assets/images";
import { smartToast } from "@/utils/toast";

export interface IPostTrainingSession {
  date: string;
  location: string;
  note?: string;
  attendance: {
    allPlayers: Array<IPlayerMini>;
    attendedBy: Array<IPlayerMini>;
  };
}

interface IProps {
  players?: IPlayer[];
  trainingSessions?: ITrainingSession[];
}

export function AttendanceTable({
  players = [],
  trainingSessions = [],
}: IProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState(false);

  const [createSession, { isLoading: isCreating }] =
    useCreateTrainingSessionMutation();
  const [updateSession, { isLoading: isUpdating }] =
    useUpdateTrainingSessionMutation();

  const todaySession = trainingSessions.find((s) => isToday(s.createdAt));

  const { handleSubmit, reset } = useForm<IPostTrainingSession>({
    defaultValues: {
      date: new Date().toISOString(),
      ...todaySession,
    },
  });

  // Pre-populate attendance checkboxes when session exists
  useEffect(() => {
    if (todaySession?.attendance?.attendedBy) {
      const initialChecked: Record<string, boolean> = {};
      todaySession.attendance.attendedBy.forEach((p) => {
        initialChecked[p._id] = true;
      });
      setChecked(initialChecked);
    }
  }, [todaySession]);

  const handleCheck = (player: IPlayer) => {
    setChecked((prev) => ({
      ...prev,
      [player._id]: !prev[player._id],
    }));
  };

  const onSubmit = async () => {
    if (!players.length) {
      toast.error("No players available");
      return;
    }

    try {
      const attendedBy = players
        .filter((p) => checked[p._id])
        .map((p) => ({
          _id: p._id,
          name: `${p.firstName} ${p.lastName}`,
          number: p.number,
          avatar: p.avatar,
        }));

      const allPlayers = players.map((p) => ({
        _id: p._id,
        name: `${p.firstName} ${p.lastName}`,
        number: p.number,
        avatar: p.avatar,
      }));

      const payload: IPostTrainingSession = {
        date: new Date().toISOString(),
        location: "Training Ground",
        note: "",
        attendance: { allPlayers, attendedBy },
      };

      let result;
      if (todaySession && editing) {
        result = await updateSession({
          _id: todaySession._id,
          ...payload,
        }).unwrap();
      } else {
        result = await createSession(payload).unwrap();
      }

      if (result.success) {
        toast.success(
          todaySession
            ? "Attendance updated successfully"
            : "Attendance saved successfully",
        );
        reset();
        setChecked({});
      }
      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  const selectedCount = Object.values(checked).filter(Boolean)?.length;

  const onSelectAll = () => {
    if (players?.every((p) => checked[p._id])) {
      players?.forEach((player) =>
        setChecked((prev) => ({
          ...prev,
          [player._id]: false,
        })),
      );
      return;
    }
    players?.forEach((player) =>
      setChecked((prev) => ({
        ...prev,
        [player._id]: true,
      })),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-5 mt-5">
        {todaySession ? (
          <p className="text-sm text-green-500">✅ Attendance recorded today</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Record attendance for today
          </p>
        )}
      </div>
      <ContentShowcaseWrapper
        images={[todaySession ? staticImages.success.src as string : staticImages.error.src as string]}
        graphicsStyles="animate-pulse max-w-32 max-h-32 md:max-w-52 md:max-h-52 md:mt-20 mx-auto"
      >
        <section className="grow">
          <br />
          <form>
            <div className="grow w-full">
              <header className="flex items-center gap-6">
                <Label className="flex items-center justify-start gap-6 font-medium uppercase p-1.5 _hover _shrink">
                  <Input
                    type="checkbox"
                    checked={players?.every((p) => checked[p._id])}
                    onChange={onSelectAll}
                    className="accent-primary cursor-pointer w-4"
                    disabled={!!todaySession && !editing}
                  />
                  <span>Select All</span>
                </Label>
                <span className="ml-auto">
                  {selectedCount}/{players?.length}
                </span>
              </header>
              {players.map((player) => {
                const name = `${player.firstName} ${player.lastName} (${player.number})`;
                return (
                  <Label
                    key={player._id}
                    className="flex items-center justify-start gap-6 font-medium uppercase p-1.5 _hover _shrink"
                  >
                    <Input
                      type="checkbox"
                      checked={!!checked[player._id]}
                      onChange={() => handleCheck(player)}
                      className="accent-primary cursor-pointer w-8"
                      disabled={!!todaySession && !editing}
                    />
                    <AVATAR src={player.avatar} alt={getInitials(name)} />
                    <span>{name}</span>
                  </Label>
                );
              })}
              <div className="grid grid-cols-3 px-1.5 py-3.5 text-muted-foreground border-t font-light">
                <span>Present: {selectedCount}</span>
                <span>Absent: {(players?.length ?? 0) - selectedCount}</span>
                <span>Total: {players?.length ?? 0}</span>
              </div>
            </div>

            <div className="py-6 flex justify-between gap-6 items-center">
              {(!todaySession || editing) && (
                <Button
                  onClick={handleSubmit(onSubmit)}
                  waiting={isCreating || isUpdating}
                  waitingText="Saving..."
                  primaryText={
                    todaySession ? "Update Attendance" : "Save Attendance"
                  }
                  className="_primaryBtn min-w-32 justify-center h-10"
                />
              )}

              {todaySession && (
                <Button
                  onClick={() => {
                    if (editing) {
                      todaySession?.attendance?.attendedBy?.forEach((p) => {
                        checked[p._id] = true;
                      });
                    }
                    setEditing(!editing);
                  }}
                  disabled={(todaySession?.updateCount ?? 0) >= 3}
                  className={`text-nowrap ${
                    editing ? "_secondaryBtn _hover" : "_primaryBtn"
                  }`}
                >
                  {editing
                    ? "Cancel Edit"
                    : `Edit Attendance (${todaySession?.updateCount ?? 0}/3)`}
                </Button>
              )}
            </div>
          </form>
        </section>
      </ContentShowcaseWrapper>
    </div>
  );
}
