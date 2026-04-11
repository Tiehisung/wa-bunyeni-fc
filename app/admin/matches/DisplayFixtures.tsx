"use client";

import { Button } from "@/components/buttons/Button";
import { isToday } from "@/lib/timeAndDate";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/pagination/Pagination";
import { IQueryResponse } from "@/types";
import { AdminMatchCard } from "./MatchCard";
import { IMatch } from "@/types/match.interface";
import { useUpdateMatchStatusMutation } from "@/services/match.endpoints";
import { showToast } from "@/utils/toast";

interface DisplayFixturesProps {
  fixtures: IQueryResponse<IMatch[]>;
}
// Fixture is  match that is not yet played successfully

export function DisplayFixtures({ fixtures }: DisplayFixturesProps) {
  return (
    <div>
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {fixtures?.data?.map((fx) => (
          <AdminMatchCard key={fx?._id} match={fx} />
        ))}
      </div>

      <div className="p-2 flex items-center text-sm gap-3 text-muted-foreground py-4">
        <div>
          Home fixtures: {fixtures?.data?.filter((f) => f.isHome)?.length}
        </div>
        <div>
          Away fixtures: {fixtures?.data?.filter((f) => !f.isHome)?.length}
        </div>
        <div>Total fixtures: {fixtures?.data?.length}</div>
      </div>
      <Pagination pagination={fixtures?.pagination} />
    </div>
  );
}

export function ToggleMatchStatus({
  fixtureId,
  status,
  matchDate,
}: {
  fixtureId: string;
  status: IMatch["status"];
  matchDate: string;
}) {
  const [updateStatus, { isLoading }] = useUpdateMatchStatusMutation();

  const handleToggle = async () => {
    const response = await updateStatus({ _id: fixtureId, status }).unwrap();
    showToast({
      message: response.message as string,
      type: response.success ? "success" : "error",
      position: "bottom-center",
    });
  };

  if (status == "FT")
    return (
      <Badge className="w-20 py-2 font-black" variant={"outline"}>
        FT
      </Badge>
    );

  if (isToday(matchDate))
    return (
      <Button
        waiting={isLoading}
        disabled={isLoading}
        primaryText={status == "LIVE" ? "Mark FT" : "Go Live"}
        waitingText="Updating..."
        onClick={handleToggle}
        className=" px-2 "
        variant="delete"
      />
    );
  return null;
}
