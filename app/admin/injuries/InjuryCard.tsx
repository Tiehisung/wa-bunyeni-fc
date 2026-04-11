"use client";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { DIALOG } from "@/components/Dialog";
import { Card } from "@/components/ui/card";
import { POPOVER } from "@/components/ui/popover";
import { formatDate } from "@/lib/timeAndDate";
import { IInjury } from "@/types/injury.interface";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Calendar,
  User,
} from "lucide-react";
import { InjuryForm } from "./InjuryForm";
import { IPlayer } from "@/types/player.interface";
import { Badge } from "@/components/ui/badge";
import { useDeleteInjuryMutation } from "@/services/injuries.endpoints";
import { smartToast } from "@/utils/toast";

export function InjuryCard({
  injury,
  selectedPlayer,
}: {
  injury: IInjury;
  selectedPlayer?: IPlayer;
}) {
  const [deleteInjury, { isLoading }] = useDeleteInjuryMutation();

  const SeverityBadge = ({ severity }: { severity: string }) => {
    const config = {
      MINOR: {
        label: "Minor",
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        icon: <AlertCircle className="h-3 w-3" />,
      },
      MODERATE: {
        label: "Moderate",
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        icon: <AlertTriangle className="h-3 w-3" />,
      },
      MAJOR: {
        label: "Major",
        className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
        icon: <AlertTriangle className="h-3 w-3" />,
      },
      SEVERE: {
        label: "Severe",
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        icon: <AlertOctagon className="h-3 w-3" />,
      },
    };

    const { label, className, icon } =
      config[severity as keyof typeof config] || config.MINOR;

    return (
      <Badge variant="outline" className={`gap-1 ${className}`}>
        {icon}
        {label}
      </Badge>
    );
  };

  const handleDelete = async () => {
    try {
      const result = await deleteInjury(injury?._id as string).unwrap();
      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <Card key={injury._id} className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <SeverityBadge severity={injury.severity} />
              <span className="text-sm text-muted-foreground">
                {formatDate(injury.createdAt)}
                {injury.minute && ` • Minute ${injury.minute}`}
              </span>
            </div>

            <h3 className="font-semibold text-lg mb-2">{injury.title}</h3>

            <p className="text-muted-foreground mb-3">{injury.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              {!selectedPlayer && (
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                    {injury.player.avatar ? (
                      <img
                        src={injury.player.avatar}
                        alt={injury.player.name}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                  </div>
                  <span className="font-medium">{injury.player.name}</span>
                  <span className="text-muted-foreground">
                    #{injury.player.number}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Reported {formatDate(injury.createdAt)}</span>
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
              <InjuryForm match={undefined} injury={injury} />
            </DIALOG>

            <ConfirmDialog
              description="Delete injury to resolve"
              onConfirm={handleDelete}
              trigger="Delete"
              triggerStyles="text-sm p-1.5 px-2 grow w-full justify-start"
              variant="destructive"
              title={injury.title}
              isLoading={isLoading}
            />
          </POPOVER>
        </div>
      </div>
    </Card>
  );
}
