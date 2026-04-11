"use client";

import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/timeAndDate";
import { Calendar, User } from "lucide-react";
import { CardForm } from "./CardForm";
import { DIALOG } from "@/components/Dialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ICard } from "@/types/card.interface";
import { IPlayer } from "@/types/player.interface";
import { POPOVER } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useDeleteCardMutation } from "@/services/cards.endpoints";
import { smartToast } from "@/utils/toast";

interface IProps {
  card: ICard;
  selectedPlayer?: IPlayer;
}

const CardCard = ({ card, selectedPlayer }: IProps) => {
  const [deleteCard] = useDeleteCardMutation();

  const handleDelete = async () => {
    try {
      const result = await deleteCard(card._id).unwrap();
      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  // Severity badge component
  const TypeBadge = ({ type }: { type: string }) => {
    const config = {
      yellow: {
        label: "🟨 Yellow",
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      },
      red: {
        label: "🟥 Red",
        className: "bg-red-100 text-red-800 hover:bg-red-100",
      },
    };

    const { label, className } =
      config[type as keyof typeof config] || config.yellow;

    return (
      <Badge variant="outline" className={`gap-1 ${className}`}>
        {label}
      </Badge>
    );
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <TypeBadge type={card.type} />
              <span className="text-sm text-muted-foreground">
                {formatDate(card.createdAt)}
                {card.minute && ` • Minute '${card.minute}`}
              </span>
            </div>

            <p className="text-muted-foreground mb-3">{card.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              {!selectedPlayer && (
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                    {card?.player?.avatar ? (
                      <img
                        src={card?.player?.avatar}
                        alt={card?.player?.name}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                  </div>
                  <span className="font-medium">{card?.player?.name}</span>
                  <span className="text-muted-foreground">
                    #{card?.player?.number}
                  </span>
                </div>
              )}

              <div className="flex items-center text-sm gap-1 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <span>Reported {formatDate(card.createdAt)}</span>
              </div>
            </div>
          </div>

          <POPOVER
            variant="ghost"
            className="w-fit space-y-1.5"
            size="icon-sm"
            triggerClassNames="rounded-full"
          >
            <DIALOG
              trigger="Edit"
              variant="ghost"
              triggerStyles="text-sm p-1.5 px-2 grow w-full justify-start"
            >
              <CardForm match={undefined} card={card} />
            </DIALOG>

            <ConfirmDialog
              description={`Are you sure you want to delete this card? \n <i>${
                card?.description ?? ""
              }</i>`}
              onConfirm={handleDelete}
              trigger="Resolve"
              triggerStyles="text-sm p-1.5 px-2 grow w-full justify-start"
              variant="destructive"
              title={card.type}
            />
          </POPOVER>
        </div>
      </div>
    </Card>
  );
};

export default CardCard;
