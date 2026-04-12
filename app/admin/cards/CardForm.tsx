"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/buttons/Button";
import { AVATAR } from "@/components/ui/avatar";
import SELECT from "@/components/select/Select";
import { Input, TextArea } from "@/components/input/Inputs";
import { IPlayer } from "@/types/player.interface";
import { EMatchStatus, IMatch } from "@/types/match.interface";
import { z } from "zod";
import { fireEscape } from "@/hooks/Esc";
import { ECardType, ICard } from "@/types/card.interface";
import { useGetMatchesQuery } from "@/services/match.endpoints";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import { smartToast } from "@/utils/toast";
import {
  useCreateCardMutation,
  useUpdateCardMutation,
} from "@/services/cards.endpoints";

const cardSchema = z.object({
  player: z.string().min(1, "Player is required"),
  minute: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(ECardType),
  match: z.string().optional(),
});

type CardFormValues = z.infer<typeof cardSchema>;

interface IProps {
  player?: IPlayer;
  match?: IMatch;
  card?: ICard;
}

export function CardForm({ match, card, player: defaultPlayer }: IProps) {
  // Fetch players
  const { data: playersData, isLoading: isLoadingPlayers } =
    useGetPlayersQuery("");

  // Fetch matches
  const { data: matchesData, isLoading: isLoadingMatches } = useGetMatchesQuery(
    { status: EMatchStatus.UPCOMING },
  );

  const [createCard, { isLoading: creating }] = useCreateCardMutation();
  const [updateCard, { isLoading: updating }] = useUpdateCardMutation();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: {},
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: card
      ? ({
          ...card,
          player: card?.player?._id,
          match: card.match?._id,
        } as CardFormValues)
      : {
          player: defaultPlayer?._id,
          match: match?._id,
          minute: "",
          description: "",
          type: ECardType.YELLOW,
        },
  });

  const selectedPlayerId = watch("player");
  const selectedPlayer = playersData?.data?.find(
    (p) => p._id === selectedPlayerId,
  );

  const onSubmit = async (data: CardFormValues) => {
    try {
      const player = playersData?.data?.find((p) => p._id === data.player);
      if (!player) return;

      const payload: Omit<ICard, "_id"> = {
        player: {
          _id: player._id,
          name: `${player.firstName} ${player.lastName}`,
          avatar: player.avatar,
          number: player.number,
        },
        description: `🤕 ${data.description}`,
        type: data.type,

        match: match ?? matchesData?.data?.find((m) => m._id == data?.match),
        minute: data.minute,
      };

      const result = card
        ? await updateCard({ ...payload, _id: card?._id } as ICard).unwrap()
        : await createCard(payload).unwrap();

      smartToast(result);
      if (result.success) {
        reset({
          player: "",
          description: "",
          type: ECardType.YELLOW,
          match: match?._id,
        });

        fireEscape();
      }
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <Card className="p-6 rounded-none">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="mb-6 text-2xl font-bold flex items-center justify-between">
          {card ? `Edit - ${card?.player?.name}` : "Add card"}:
          <AVATAR alt="IP" src={selectedPlayer?.avatar as string} />
        </h2>

        <div className="space-y-4">
          {/* Player */}
          {!(defaultPlayer || card) && (
            <Controller
              control={control}
              name="player"
              render={({ field, fieldState }) => (
                <SELECT
                  {...field}
                  options={
                    playersData?.data?.map((p) => ({
                      label: `${p.number} - ${p.lastName} ${p.firstName}`,
                      value: p._id,
                    })) ?? []
                  }
                  label="Player"
                  placeholder="Select"
                  selectStyles="w-full "
                  error={fieldState?.error?.message}
                  className="grid"
                  loading={isLoadingPlayers}
                />
              )}
            />
          )}
          {!(match || card) && (
            <Controller
              control={control}
              name="match"
              render={({ field, fieldState }) => (
                <SELECT
                  {...field}
                  options={
                    matchesData?.data?.map((m) => ({
                      label: m.title,
                      value: m._id,
                    })) ?? []
                  }
                  label="Match"
                  placeholder="Select"
                  selectStyles="w-full "
                  error={fieldState?.error?.message}
                  className="grid"
                  loading={isLoadingMatches}
                />
              )}
            />
          )}
          {/* Severity */}
          <Controller
            control={control}
            name="type"
            render={({ field, fieldState }) => (
              <SELECT
                {...field}
                options={[
                  { label: "🟨 Yellow ", value: ECardType.YELLOW },
                  { label: "🟥 Red ", value: ECardType.RED },
                ]}
                label="Card type"
                placeholder="Select"
                className="grid"
                error={fieldState?.error?.message}
              />
            )}
          />
          {/* Minute */}

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
            waiting={!card ? creating : updating}
            className="w-full"
            primaryText={card ? "Edit card" : "Add card"}
            waitingText={card ? "Editing card" : "Adding card"}
          >
            <Plus className="mr-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}
