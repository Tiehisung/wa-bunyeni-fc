"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EPlayerPosition, IPlayerMini } from "@/types/player.interface";
import { Card } from "@/components/ui/card";
import SELECT from "@/components/select/Select";
import { Button } from "@/components/buttons/Button";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { TextArea } from "@/components/input/Inputs";
import { Label } from "@/components/ui/label";

import { formatDate, getTimeLeftOrAgo } from "@/lib/timeAndDate";
import { enumToOptions } from "@/lib/select";
import { IMatch } from "@/types/match.interface";
import {
  useCreateSquadMutation,
  useGetSquadByMatchQuery,
  useUpdateSquadMutation,
} from "@/services/squad.endpoints";
import { ISquad } from "@/types/squad.interface";
import { smartToast } from "@/utils/toast";
import { useGetStaffMembersQuery } from "@/services/staff.endpoints";
import { IQueryResponse, ISelectOptionLV } from "@/types";
import { CHECKBOX } from "../../../components/input/Checkbox";
import { H } from "@/components/Element";
import { fireEscape } from "@/hooks/Esc";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import { useGetMatchesQuery } from "@/services/match.endpoints";
import PageLoader from "@/components/loaders/Page";

// Zod Validation Schema
const squadSchema = z.object({
  match: z.any(),
  description: z.string().max(500).optional(),
  selectedPlayers: z
    .record(z.string(), z.boolean())
    .refine((players) => Object.values(players).filter(Boolean).length >= 11, {
      message: "Select at least 11 players",
    }),
  positions: z.record(z.string(), z.enum(EPlayerPosition).optional()),
  coach: z.string().min(1, "Coach is required"),
  assistant: z.string().optional(),
});

export type IPostSquad = z.infer<typeof squadSchema>;
interface IProps {
  defaultMatch?: IMatch;
  onSuccess?: () => void;
}

const SquadForm = ({ defaultMatch, onSuccess }: IProps) => {
  const { data: staffData, isLoading: loadingSquad } =
    useGetStaffMembersQuery("");

  const { data: squadData } = useGetSquadByMatchQuery(
    defaultMatch?._id as string,
    { skip: !defaultMatch },
  );
  const existingSquad = squadData?.data;

  const { data: playersData } = useGetPlayersQuery("");
  const players = playersData?.data || [];

  const [createSquad, { isLoading: isCreating }] = useCreateSquadMutation();
  const [updateSquad, { isLoading: isUpdating }] = useUpdateSquadMutation();

  const { data: matchesData, isLoading: loadingMatches } = useGetMatchesQuery(
    {},
  );
  const matches = matchesData?.data || [];

  const { handleSubmit, control, setValue, watch, reset } = useForm<IPostSquad>(
    {
      resolver: zodResolver(squadSchema),
      defaultValues: {
        match: defaultMatch,
        selectedPlayers: {},
        positions: {},
        coach: existingSquad?.coach?._id,
        assistant: existingSquad?.assistant?._id || "",
        description: existingSquad?.description || "",
      },
    },
  );

  useEffect(() => {
    if (existingSquad) {
      // Map selected players
      const selectedPlayersMap = existingSquad.players.reduce(
        (acc, player) => {
          acc[player._id] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      );

      // Map positions
      const positionsMap = existingSquad.players.reduce(
        (acc, player) => {
          if (player.position) {
            acc[player._id] = player.position as EPlayerPosition;
          }
          return acc;
        },
        {} as Record<string, EPlayerPosition>,
      );

      reset({
        match: existingSquad.match,
        description: existingSquad.description || "",
        coach: existingSquad.coach?._id || "",
        assistant: existingSquad.assistant?._id || "",
        selectedPlayers: selectedPlayersMap,
        positions: positionsMap,
      });
    } else {
      // Create positions object from player data
      const initialSelection = players?.slice(0, 11).reduce(
        (acc, player) => {
          acc[player._id] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      );

      const initialPositions = players?.reduce(
        (acc, player) => {
          if (player.position) {
            acc[player._id] = player.position;
          }
          return acc;
        },
        {} as Record<string, EPlayerPosition>,
      );

      setValue("selectedPlayers", initialSelection);

      setValue("positions", initialPositions);
    }
  }, [players, existingSquad, reset, setValue]);

  const selectedPlayers = watch("selectedPlayers");
  const positions = watch("positions");
  const selectedMatch = watch("match");

  const onSubmit = async (data: IPostSquad) => {
    try {
      const selectedCount = Object.values(data.selectedPlayers || {}).filter(
        Boolean,
      ).length;

      if (selectedCount < 11) {
        smartToast({
          success: false,
          message: `Please select at least 11 players for the squad. Currently selected: ${selectedCount}`,
        });
        return;
      }

      const coachObj = staffData?.data?.find((m) => m._id === data.coach);
      const assistantObj = staffData?.data?.find(
        (m) => m._id === data.assistant,
      );

      const payload: ISquad = {
        description: data.description,
        coach: coachObj
          ? {
              _id: coachObj._id,
              name: coachObj.fullname,
              avatar: coachObj.avatar,
            }
          : undefined,
        assistant: assistantObj
          ? {
              _id: assistantObj._id,
              name: assistantObj.fullname,
              avatar: assistantObj.avatar,
            }
          : undefined,
        players: players
          ?.filter((p) => data.selectedPlayers[p._id])
          ?.map(
            (p) =>
              ({
                _id: p._id,
                name: `${p.firstName} ${p.lastName}`,
                position: data.positions[p._id] || p.position,
                avatar: p.avatar,
                number: p.number,
              }) as IPlayerMini,
          ),
        match: data.match as IMatch,
      };

      let result: IQueryResponse;

      if (!existingSquad) {
        result = await createSquad(payload).unwrap();
        if (result.success) {
          reset({
            selectedPlayers: {},
            positions: {},
            description: "",
            match: undefined,
            coach: "",
            assistant: "",
          });
        }
      } else {
        result = await updateSquad({
          id: existingSquad?._id as string,
          body: payload,
        }).unwrap();
      }

      smartToast(result);

      fireEscape();

      onSuccess?.();
    } catch (error) {
      smartToast({ error });
    }
  };

  if (loadingSquad) return <PageLoader />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grow space-y-4">
      <H>{existingSquad ? "UPDATE" : "CREATE NEW"} SQUAD</H>
      <Card className="p-2 ">
        <header>
          <div className="flex gap-4 justify-between items-center flex-wrap border-b pb-5">
            {/* Opponent Select */}
            <div className="w-full sm:w-auto">
              <Label className="mb-2">MATCH</Label>
              <Controller
                name="match"
                control={control}
                render={({ field, fieldState }) => (
                  <SELECT
                    options={matches.map((f) => ({
                      label: `${f.title}`,
                      value: f._id,
                    }))}
                    placeholder="Match"
                    value={field?.value?._id as string}
                    onChange={(v) =>
                      field.onChange(matches.find((f) => f._id === v))
                    }
                    error={fieldState?.error?.message}
                    disabled={!!defaultMatch}
                    loading={loadingMatches}
                  />
                )}
              />
            </div>

            {/* Venue Select */}
            <div className="w-full sm:w-auto">
              <Label className="mb-2">VENUE</Label>
              <div>{selectedMatch?.isHome ? "Home" : "Away"}</div>
            </div>
            <div className="w-full sm:w-auto">
              <Label className="mb-2">DATE</Label>
              <div>
                {formatDate(selectedMatch?.date, "March 2, 2025")}(
                {getTimeLeftOrAgo(selectedMatch?.date).formatted})
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <Label className="mb-2">TIME</Label>
              <div>{selectedMatch?.time}</div>
            </div>

            {/* Match Description */}
            <div className="w-full">
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <TextArea
                    {...field}
                    error={fieldState?.error?.message}
                    placeholder="Description"
                    dataTip="Description of this match event"
                  />
                )}
              />
            </div>
          </div>
        </header>

        <main>
          {/* Players Table */}
          <div className="overflow-x-auto">
            <table className="">
              <thead>
                <tr className="border-b border-border font-semibold">
                  <th className="text-left py-3">PLAYER</th>
                  <th className="text-left py-3">POSITION</th>
                </tr>
              </thead>

              <tbody>
                {players?.map((player) => {
                  const isSelected = selectedPlayers[player._id];

                  return (
                    <tr
                      key={player._id}
                      className={`border-b border-border transition-colors ${
                        isSelected ? "bg-popover" : ""
                      }`}
                    >
                      <td className="py-3 font-semibold uppercase">
                        <Button
                          type="button"
                          onClick={() =>
                            setValue(
                              `selectedPlayers.${player._id}`,
                              !isSelected,
                            )
                          }
                          className="hover:opacity-90 rounded-none"
                          variant="ghost"
                        >
                          {isSelected ? (
                            <MdCheckBox
                              size={24}
                              className="text-ring min-h-5 min-w-5"
                            />
                          ) : (
                            <MdCheckBoxOutlineBlank
                              size={24}
                              className="text-muted-foreground min-h-5 min-w-5"
                            />
                          )}
                          {`${player.lastName} ${player.firstName}`}
                          <span>({player?.number})</span>
                        </Button>
                      </td>

                      <td className="text-center py-3">
                        <SELECT
                          options={enumToOptions(EPlayerPosition)}
                          placeholder="Position"
                          className="capitalize"
                          onChange={(val) =>
                            setValue(
                              `positions.${player._id}`,
                              val as EPlayerPosition,
                            )
                          }
                          disabled={!selectedPlayers?.[player._id]}
                          value={positions?.[player._id] || player?.position}
                          required={!!selectedPlayers?.[player._id]}
                          name={`pos-${player._id}`}
                          error={
                            isSelected && !positions?.[player._id]
                              ? "Required"
                              : ""
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Coach Selection */}
          <div className="mt-10">
            <h1 className="font-semibold mb-2">Technical Leadership</h1>

            <div className="grid md:flex items-center gap-3">
              <Controller
                name="coach"
                control={control}
                render={({ field, fieldState }) => (
                  <SELECT
                    options={
                      staffData?.data?.map((m) => ({
                        label: m.fullname,
                        value: m._id,
                      })) as ISelectOptionLV[]
                    }
                    placeholder="Coach"
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState?.error?.message}
                    name="coach"
                    label={"Coach"}
                    className="grid"
                  />
                )}
              />

              <Controller
                name="assistant"
                control={control}
                render={({ field, fieldState }) => (
                  <SELECT
                    options={
                      staffData?.data?.map((m) => ({
                        label: m.fullname,
                        value: m._id,
                      })) as ISelectOptionLV[]
                    }
                    placeholder="Assistant"
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState?.error?.message}
                    name="assistant"
                    label={"Assistant"}
                    className="grid"
                  />
                )}
              />
            </div>
          </div>

          <div className="mt-6 text-right flex items-center gap-6 ">
            <Button
              type="submit"
              primaryText={existingSquad ? "Update Squad" : "Save Squad"}
              waiting={isCreating || isUpdating}
            />
            <CHECKBOX label="Save as template" />
          </div>
        </main>
      </Card>
    </form>
  );
};

export default SquadForm;
