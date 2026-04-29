"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/buttons/Button";
import { AVATAR } from "@/components/ui/avatar";
import SELECT from "@/components/select/Select";
import { TextArea } from "@/components/input/Inputs";
import { EPlayerPosition, IPlayer } from "@/types/player.interface";
import { EMatchStatus, IMatch } from "@/types/match.interface";
import { z } from "zod";
import { fireEscape } from "@/hooks/Esc";
import { enumToOptions } from "@/lib/select";
import { IMVP } from "@/types/mvp.interface";
import { useGetMatchesQuery } from "@/services/match.endpoints";
import {
  useCreateMvpMutation,
  useUpdateMvpMutation,
} from "@/services/mvps.endpoints";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import { IQueryResponse } from "@/types";
import { smartToast } from "@/utils/toast";
import { Glassmorphic } from "@/components/Glasmorphic/BasicGlassmorphic";

const mvpSchema = z.object({
  player: z.string().min(1, "Player is required"),
  description: z.string().optional(),
  positionPlayed: z.enum(EPlayerPosition),
  match: z.string().optional(),
});

type MvpFormValues = z.infer<typeof mvpSchema>;

interface IProps {
  player?: IPlayer;
  match?: IMatch;
  mvp?: IMVP;
}

export function MVPForm({
  match: defaultMatch,
  mvp: defaultMVP,
  player: defaultPlayer,
}: IProps) {
  // Fetch players
  const { data: playersData, isLoading: isLoadingPlayers } =
    useGetPlayersQuery("");

  // Fetch matches
  const { data: matchesData, isLoading: isLoadingMatches } = useGetMatchesQuery(
    { status: EMatchStatus.UPCOMING },
  );
  const players = playersData?.data || [];
  const matches = matchesData?.data || [];

  // Mutations
  const [createMvp, { isLoading: isCreating }] = useCreateMvpMutation();
  const [updateMvp, { isLoading: isUpdating }] = useUpdateMvpMutation();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<MvpFormValues>({
    resolver: zodResolver(mvpSchema),
    defaultValues: defaultMVP
      ? ({
          ...defaultMVP,
          player:
            typeof defaultMVP?.player === "object"
              ? defaultMVP?.player?._id
              : defaultMVP?.player,
          match:
            typeof defaultMVP?.match === "object"
              ? defaultMVP.match?._id
              : defaultMVP?.match,
        } as MvpFormValues)
      : {
          player: defaultPlayer?._id,
          match: defaultMatch?._id,
          description: "",
          positionPlayed: defaultPlayer?.position,
        },
  });

  const selectedPlayerId = watch("player");
  const selectedPlayer = players?.find((p) => p._id === selectedPlayerId);

  const onSubmit = async (data: MvpFormValues) => {
    try {
      const player = players?.find((p) => p._id === data.player);
      if (!player) return;

      const _match = defaultMatch ?? matches?.find((m) => m._id == data?.match);

      const payload = {
        ...data,
        player: {
          _id: player._id,
          name: `${player.firstName} ${player.lastName}`,
          avatar: player.avatar,
          number: player.number,
        },
        description: `${data.description}`,
        positionPlayed: data.positionPlayed,
        match: _match,
        date: _match?.date,
      };

      let response: IQueryResponse<IMVP>;
      if (defaultMVP) {
        response = await updateMvp({
          _id: defaultMVP._id,
          ...payload,
        }).unwrap();
      } else {
        response = await createMvp(payload).unwrap();
      }

      if (response.success) {
        reset({
          player: "",
          description: "",
          positionPlayed: defaultPlayer?.position,
          match: defaultMatch?._id,
        });

        fireEscape();
      }
      smartToast(response);
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Glassmorphic className="space-y-4 p-3">
        <h2 className="mb-6 text-2xl font-bold flex items-center justify-between">
          {defaultMVP ? `Edit - ${defaultMVP?.player?.name}` : "Add MoTM"}:
          <AVATAR src={selectedPlayer?.avatar as string} alt="IP" />
        </h2>

        {/* Player */}
        {!(defaultPlayer || defaultMVP) && (
          <Controller
            control={control}
            name="player"
            render={({ field, fieldState }) => (
              <SELECT
                {...field}
                options={
                  players?.map((p) => ({
                    label: `${p.number} - ${p.lastName} ${p.firstName}`,
                    value: p._id,
                  })) ?? []
                }
                label="Player"
                placeholder="Select"
                selectStyles="w-full    "
                error={fieldState?.error?.message}
                className="grid"
                loading={isLoadingPlayers}
              />
            )}
          />
        )}

        {!(defaultMatch || defaultMVP) && (
          <Controller
            control={control}
            name="match"
            render={({ field, fieldState }) => (
              <SELECT
                {...field}
                options={
                  matches?.map((m) => ({
                    label: m.title,
                    value: m._id,
                  })) ?? []
                }
                label="Match"
                placeholder="Select"
                selectStyles="w-full"
                error={fieldState?.error?.message}
                className="grid"
                loading={isLoadingMatches}
              />
            )}
          />
        )}

        {/* Position Played */}
        <Controller
          control={control}
          name="positionPlayed"
          render={({ field, fieldState }) => (
            <SELECT
              {...field}
              options={enumToOptions(EPlayerPosition)}
              label="Position Played"
              placeholder="Select"
              selectStyles="w-full"
              error={fieldState?.error?.message}
              className="grid"
            />
          )}
        />

        {/* Description */}
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <TextArea
              {...field}
              label="Description"
              placeholder="e.g., Wrong celebration, fight..."
              error={fieldState?.error?.message}
            />
          )}
        />

        <Button
          type="submit"
          waiting={isSubmitting || isCreating || isUpdating}
          className="w-full "
          primaryText={defaultMVP ? "Edit MoTM" : "Add MoTM"}
          waitingText={defaultMVP ? "Editing MoTM..." : "Adding MoTM..."}
        >
          <Plus className="mr-2 h-4 w-4" />
        </Button>
      </Glassmorphic>
    </form>
  );
}
