"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/buttons/Button";
import { AVATAR } from "@/components/ui/avatar";
import { enumToOptions } from "@/lib/select";
import SELECT from "@/components/select/Select";
import { Input, TextArea } from "@/components/input/Inputs";
import { IPlayer } from "@/types/player.interface";
import { IMatch } from "@/types/match.interface";
import { IInjury, EInjurySeverity } from "@/types/injury.interface";
import { z } from "zod";
import { fireEscape } from "@/hooks/Esc";
import {
  useCreateInjuryMutation,
  useUpdateInjuryMutation,
} from "@/services/injuries.endpoints";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import { smartToast } from "@/utils/toast";

const injurySchema = z.object({
  player: z.string().min(1, "Player is required"),
  minute: z.string().optional(),
  title: z.string().min(5, "Title is required"),
  description: z.string().optional(),
  severity: z.enum(EInjurySeverity),
});

type InjuryFormValues = z.infer<typeof injurySchema>;

interface InjuryEventsTabProps {
  player?: IPlayer;
  match?: IMatch;
  injury?: IInjury;
}

export function InjuryForm({
  match,
  injury,
  player: defaultPlayer,
}: InjuryEventsTabProps) {
  // Fetch players using RTK Query
  const { data: playersData, isLoading: playersLoading } =
    useGetPlayersQuery("");
  const players = playersData?.data || [];

  // RTK Query mutations
  const [createInjury, { isLoading: isCreating }] = useCreateInjuryMutation();
  const [updateInjury, { isLoading: isUpdating }] = useUpdateInjuryMutation();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<InjuryFormValues>({
    resolver: zodResolver(injurySchema),
    defaultValues: injury
      ? ({
          ...injury,
          player:
            typeof injury.player === "object"
              ? injury.player._id
              : injury.player,
        } as InjuryFormValues)
      : {
          player: defaultPlayer?._id,
          title: match?.title || "",
          minute: "",
          description: "",
          severity: EInjurySeverity.MINOR,
        },
  });

  const selectedPlayerId = watch("player");
  const selectedPlayer = players?.find((p) => p._id === selectedPlayerId);

  const onSubmit = async (data: InjuryFormValues) => {
    try {
      const player = players?.find((p) => p._id === data.player);
      if (!player) {
        toast.error("Player not found");
        return;
      }

      const payload: Partial<IInjury> = {
        player: {
          _id: player._id,
          name: `${player.firstName} ${player.lastName}`,
          avatar: player.avatar,
          number: Number(player.number),
        },
        description: `🤕 ${data.description}`,
        severity: data.severity,
        title: data.title,
        minute: data.minute,
      };

      if (match) {
        payload.match = match;
      }

      let result;
      if (injury) {
        // Update existing injury
        result = await updateInjury({
          _id: injury._id as string,
          ...payload,
        }).unwrap();
      } else {
        // Create new injury
        result = await createInjury(payload).unwrap();
      }

      smartToast(result);

      if (result.success) {
        reset({
          player: "",
          title: match?.title ?? "",
          minute: "",
          description: "",
          severity: EInjurySeverity.MINOR,
        });

        fireEscape();
      }
    } catch (error) {
      smartToast({ error });
    }
  };

  if (playersLoading) {
    return (
      <Card className="p-6 rounded-none">
        <div className="flex justify-center items-center h-64">
          <p>Loading players...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 rounded-none">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="mb-6 text-2xl font-bold flex items-center justify-between">
          {injury
            ? `Edit - ${typeof injury.player === "object" ? injury.player?.name : ""}`
            : "Add Injury"}
          :
          <AVATAR src={selectedPlayer?.avatar as string} alt="IP" />
        </h2>

        <div className="space-y-4">
          {/* Player */}
          {!(defaultPlayer || injury) && (
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
                  selectStyles="w-full"
                  error={fieldState?.error?.message}
                  className="grid"
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="title"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Title"
                placeholder="e.g. Title"
                error={fieldState?.error?.message}
              />
            )}
          />

          {/* Minute */}
          {match && (
            <Controller
              control={control}
              name="minute"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type="number"
                  label="Minute"
                  placeholder="e.g. 25"
                  others={{ min: 0, max: 120 }}
                  error={fieldState?.error?.message}
                />
              )}
            />
          )}

          {/* Severity */}
          <Controller
            control={control}
            name="severity"
            render={({ field, fieldState }) => (
              <SELECT
                {...field}
                options={enumToOptions(EInjurySeverity)}
                label="Severity"
                placeholder="Select"
                className="grid"
                error={fieldState?.error?.message}
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
                placeholder="e.g., Hamstring, head injury..."
                error={fieldState?.error?.message}
              />
            )}
          />

          <Button
            type="submit"
            waiting={isSubmitting || isCreating || isUpdating}
            className="w-full "
            primaryText={injury ? "Edit Injury" : "Add Injury"}
            waitingText={injury ? "Editing Injury..." : "Adding Injury..."}
          >
            <Plus className="mr-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}
