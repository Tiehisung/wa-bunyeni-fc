"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Users, CalendarDays, MapPin, Clock, UserCog } from "lucide-react";
import { formatDate, getTimeAgo } from "@/lib/timeAndDate";
import { ITrainingSession } from "./page";
import { getInitials } from "@/lib";
import { ConfirmActionButton } from "@/components/buttons/ConfirmAction";
import { useDeleteTrainingSessionMutation } from "@/services/training.endpoints";

import { toast } from "sonner";
 

interface Props {
  trainingSession?: ITrainingSession;
}

const TrainingSessionCard = ({ trainingSession }: Props) => {
 
  const [deleteSession] = useDeleteTrainingSessionMutation();

  if (!trainingSession) {
    return <div className="_label text-center m-6">Session not found</div>;
  }

  const handleDelete = async () => {
    try {
      const result = await deleteSession(trainingSession._id).unwrap();
      if (result.success) {
        toast.success(result.message);
  
      }
    } catch (error) {
      toast.error("Failed to delete training session");
    }
  };

  return (
    <Card className="shadow-lg border-0 overflow-hidden rounded-none mb-12">
      <CardHeader className="bg-muted/40 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Training Session
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-3 mt-1 text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin size={16} /> {trainingSession?.location}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays size={16} />{" "}
                {formatDate(trainingSession?.createdAt, "March 2, 2025")}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} />{" "}
                {trainingSession?.createdAt?.split("T")?.[1]?.substring(0, 5)}
              </span>
            </CardDescription>
          </div>
        </div>

        {trainingSession?.note && (
          <p className="mt-3 text-sm text-muted-foreground italic">
            “{trainingSession?.note}”
          </p>
        )}
      </CardHeader>

      <CardContent className="py-6">
        {/* Players Section */}
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Users size={18} /> Players (
          {trainingSession?.attendance?.attendedBy?.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainingSession?.attendance?.attendedBy?.map((player) => (
            <div
              key={player?._id}
              className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl border border-border hover:shadow-md transition"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={player?.avatar} alt={player?.name} />
                <AvatarFallback>
                  {player?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-sm uppercase">
                  {player?.name}
                </span>
                <Badge
                  variant="outline"
                  className="text-xs mt-1 capitalize w-fit"
                >
                  #{player?.number}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        {/* Recorded By */}
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <UserCog size={18} /> Recorded By
        </h3>

        <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl border border-border">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={trainingSession?.recordedBy?.avatar}
              alt={trainingSession?.recordedBy?.name}
            />
            <AvatarFallback>
              {getInitials(trainingSession?.recordedBy?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">
              {trainingSession?.recordedBy?.name || "N/A"}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-between text-sm text-muted-foreground">
        <p>
          Date: {formatDate(trainingSession?.createdAt)} (
          {getTimeAgo(trainingSession?.createdAt as string)})
        </p>

        <ConfirmActionButton
          primaryText="Delete"
          onConfirm={handleDelete}
          variant="destructive"
          title="Delete Attendance"
          confirmText={`Are you sure you want to delete "${formatDate(
            trainingSession?.date,
            "March 2, 2025",
          )}" attendance?`}
        />
      </CardFooter>
    </Card>
  );
};

export default TrainingSessionCard;
