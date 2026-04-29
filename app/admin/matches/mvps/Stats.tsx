"use client";

import { CountupMetricCard } from "@/components/Metrics/Cards";
import { AVATAR } from "@/components/ui/avatar";
import { IQueryResponse } from "@/types";
import { IMVP } from "@/types/mvp.interface";
import { AlertCircle } from "lucide-react";
import { computeMVPs } from ".";
import { DIALOG } from "@/components/Dialog";
import { StackModal } from "@/components/modals/StackModal";
import { useState } from "react";
import MvpCard from "./MvpCard";
import { toggleClick } from "@/lib/dom";

interface IProps {
  mvps?: IQueryResponse<IMVP[]> | null;
  loading?: boolean;
}
export function MVPsStats({ loading, mvps }: IProps) {
  // Get mvps statistics

  const { total, leaderboard } = computeMVPs(mvps?.data ?? []);

  const [targetPlayer, setTargetPlayer] = useState<{
    player: IMVP["player"];
    total: number;
    mvps: IMVP[];
  } | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 items-center justify-center">
      <CountupMetricCard
        icon={<AlertCircle className="h-9 w-9" />}
        value={total}
        isLoading={loading}
        isCountUp
        description="Total MVPs"
        color="gray"
      />

      {leaderboard?.slice(0, 2)?.map((dt, i) => (
        <CountupMetricCard
          key={i}
          icon={
            <AVATAR
              src={dt.player?.avatar as string}
              alt={dt.player.name}
              className="h-9 w-9"
            />
          }
          value={dt?.total}
          isLoading={loading}
          isCountUp
          description={dt.player.name}
          color="yellow"
        />
      ))}

      <StackModal
        trigger={"LEADERBOARD"}
        variant={"outline"}
        triggerStyles="h-32"
        title="MoTM Rankings"
        className="min-w-[80vw]"
        id={"leaderboard"}
      >
        <div className="flex gap-4 p-3.5 items-center flex-wrap">
          {leaderboard.map((pl, i) => (
            <CountupMetricCard
              key={i}
              icon={
                <AVATAR
                  src={pl.player?.avatar as string}
                  alt={pl.player.name}
                  className="h-9 w-9"
                />
              }
              value={pl?.total}
              isLoading={loading}
              isCountUp
              description={pl.player.name}
              color={i < 3 ? "green" : "yellow"}
              onClick={() => {
                toggleClick("mvps-details-modal");
                setTargetPlayer(pl);
              }}
              className="ring ring-border"
            />
          ))}
        </div>

        <DIALOG
          variant={"secondary"}
          trigger={undefined}
          id="mvps-details-modal"
          triggerStyles="hidden"
          title={
            <div className="flex items-center gap-6">
              <AVATAR
               
                src={targetPlayer?.player?.avatar as string}
                alt="IP"
              />
              <p className="text-xl font-semibold">
                {targetPlayer?.player?.name}
              </p>
            </div>
          }
        >
          <div className="grid items-center gap-6">
            {targetPlayer?.mvps?.map((tm, i) => (
              <MvpCard mvp={tm} key={i} />
            ))}
          </div>
        </DIALOG>
      </StackModal>
    </div>
  );
}
