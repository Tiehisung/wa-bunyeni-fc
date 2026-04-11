"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  AVATAR,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Users, CalendarDays, MapPin, Clock, UserCog } from "lucide-react";

import {
  formatDate,
  getDeadlineInfo,
  getTimeLeftOrAgo,
} from "@/lib/timeAndDate";
import { ConfirmActionButton } from "@/components/buttons/ConfirmAction";
import { IMatch } from "@/types/match.interface";
import {
  useDeleteSquadMutation,
  useGetSquadByMatchQuery,
} from "@/services/squad.endpoints";
import { useAuth } from "@/store/hooks/useAuth";
import { smartToast } from "@/utils/toast";
import { fireEscape } from "@/hooks/Esc";
import PageLoader from "@/components/loaders/Page";
import { Button } from "@/components/buttons/Button";
import { useSearchParams } from "@/lib/searchParams";
import SquadForm from "./SquadForm";

interface SquadDisplayProps {
  match?: IMatch;
}

const SquadCard = ({ match }: SquadDisplayProps) => {
  const { user } = useAuth();

  const { getSearchParam, setSearchParams } = useSearchParams();

  const { data: squadData, isLoading: loadingSquad } = useGetSquadByMatchQuery(
    match?._id as string,
    {
      skip: !match,
    },
  );

  const squad = squadData?.data;
  const [deleteSquad, { isLoading: deletingSquad }] = useDeleteSquadMutation();

  const handleDelete = async () => {
    try {
      const result = await deleteSquad(squad?._id || "").unwrap();
      if (result.success) {
        smartToast(result);
        fireEscape();
      }
    } catch (error: any) {
      smartToast({ error: error.message || "Failed to delete squad" });
    }
  };

  const isLocked =
    user?.role !== "super_admin" &&
    getDeadlineInfo(match?.date as string, 5).isPassed;

  if (loadingSquad) return <PageLoader />;

  if (getSearchParam("sq_mode") == "editing")
    return (
      <SquadForm
        defaultMatch={match}
        onSuccess={() => setSearchParams("sq_mode", "")}
      />
    );

  return (
    <Card className="p-2 border-0 overflow-hidden rounded-none ml-2.5 mb-12">
      <CardHeader className="bg-muted/40 py-5 px-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              {squad?.title ?? "Unknown"}
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-3 mt-1 text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin size={16} />{" "}
                {(squad?.match?.isHome ?? match?.isHome) ? "Home" : "Away"}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays size={16} />{" "}
                {formatDate(squad?.match?.date ?? match?.date, "March 2, 2025")}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} /> {squad?.match?.time ?? match?.time}
              </span>
            </CardDescription>
          </div>
        </div>

        {squad?.description && (
          <p className="mt-3 text-sm text-muted-foreground italic">
            “{squad?.description}”
          </p>
        )}
      </CardHeader>

      <CardContent className="py-6 px-0">
        {/* Players Section */}
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Users size={18} /> Players ({squad?.players?.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {squad?.players?.map((player) => (
            <div
              key={player?._id}
              className="flex items-center gap-3 bg-muted/30 overflow-hidden rounded-xl border border-border hover:shadow-md transition"
            >
              <AVATAR
                src={player?.avatar as string}
                alt={player?.name}
                shape="square"
                size="xl"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-sm uppercase">
                  {player?.name}
                </span>
                <Badge variant="outline" className="text-xs mt-1 capitalize">
                  {player?.position}
                </Badge>

                <span>{player?.number}</span>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        {/* Technical Team */}
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <UserCog size={18} /> Technical Leadership
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Coach */}
          <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl border border-border">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={squad?.coach?.avatar}
                alt={squad?.coach?.name}
              />
              <AvatarFallback>
                {squad?.coach?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">
                {squad?.coach?.name || "N/A"}
              </span>
              <Badge variant="secondary" className="text-xs mt-1">
                Coach
              </Badge>
            </div>
          </div>

          {/* Assistant */}
          <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl border border-border">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={squad?.assistant?.avatar}
                alt={squad?.assistant?.name}
              />
              <AvatarFallback>
                {squad?.assistant?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">
                {squad?.assistant?.name || "N/A"}
              </span>
              <Badge variant="secondary" className="text-xs mt-1">
                Assistant Coach
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>

      <footer className="justify-between text-sm text-muted-foreground ">
        {user?.role?.includes("admin") && (
          <>
            <p className="italic">
              Modified: {formatDate(squad?.createdAt)} (
              {getTimeLeftOrAgo(squad?.createdAt as string).formatted})
            </p>
            <p className="text-sm font-thin p-2 border border-destructive text-destructive rounded-lg my-3 ">
              Can not modify after{" "}
              <Badge variant={"secondary"}>
                {getDeadlineInfo(match?.date as string, 5).deadline}
              </Badge>
            </p>
            <div className="flex items-center gap-5 ">
              <Button
                onClick={() => setSearchParams("sq_mode", "editing")}
                disabled={isLocked}
                variant={"secondary"}
              >
                Edit
              </Button>

              <ConfirmActionButton
                primaryText="Delete Squad"
                onConfirm={handleDelete}
                variant="destructive"
                title="Delete Squad"
                confirmText={`Are you sure you want to delete "${squad?.title}" Squad?`}
                isLoading={deletingSquad}
                disabled={isLocked}
              />
            </div>
          </>
        )}
      </footer>
    </Card>
  );
};

export default SquadCard;
