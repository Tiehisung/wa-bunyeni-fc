"use client";

import { useState, useMemo } from "react";
import { Filter, AlertTriangle, Plus } from "lucide-react";
import { EPlayerPosition, IPlayer } from "@/types/player.interface";
import { ClearBtn } from "@/components/buttons/ClearFilters";
import SELECT from "@/components/select/Select";
import { DIALOG } from "@/components/Dialog";
import Loader from "@/components/loaders/Loader";
import { IQueryResponse } from "@/types";
import { PlayerDisplayPanel } from "../../players/PlayerDisplay";
import { MVPForm } from "./MvpForm";
import { IMVP } from "@/types/mvp.interface";
import { MVPsStats } from "./Stats";
import MvpCard from "./MvpCard";
import { Card } from "@/components/ui/card";
import { enumToOptions } from "@/lib/select";

interface IProps {
  mvpsData?: IQueryResponse<IMVP[]>;
}

export function MVPsManager({ mvpsData }: IProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<IPlayer | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Get mvps for selected player or all mvps
  const playerMVPs = useMemo(() => {
    let mvps = selectedPlayer
      ? mvpsData?.data?.filter((mvp) => mvp?.player?._id === selectedPlayer._id)
      : mvpsData?.data;

    // Apply type filter
    if (typeFilter !== "all") {
      mvps = mvps?.filter((mvp) => mvp.positionPlayed === typeFilter);
    }

    // Sort by date (newest first)
    return [...(mvpsData?.data ?? [])]?.sort(
      (a, b) =>
        new Date(b?.createdAt as string).getTime() -
        new Date(a?.createdAt as string).getTime(),
    );
  }, [mvpsData, selectedPlayer, typeFilter]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div />

        <DIALOG
          trigger={
            <>
              <Plus size={24} />
              <span className="max-sm:hidden">New MVP Report</span>
            </>
          }
          variant={"outline"}
        >
          <MVPForm />
        </DIALOG>
      </div>

      <MVPsStats mvps={mvpsData} loading={!mvpsData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Player List */}
        <PlayerDisplayPanel
          onSelect={(player) => setSelectedPlayer(player ?? null)}
        />
        {/* Right Panel: mvps */}
        <Card className="lg:col-span-2">
          <header className="p-4 border-b">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {selectedPlayer
                    ? `mvps - ${selectedPlayer.firstName} ${selectedPlayer.lastName}`
                    : "All mvps"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {playerMVPs?.length}
                  {playerMVPs?.length !== 1 ? " mvps" : " injury"} found
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm">
                  <Filter className="h-4 w-4" />
                  <span>Filter:</span>
                </div>

                <SELECT
                  options={enumToOptions(EPlayerPosition)}
                  placeholder="Player Position"
                  value={typeFilter}
                  onChange={(v) => setTypeFilter(v)}
                />

                {selectedPlayer && (
                  <ClearBtn
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPlayer(null)}
                    label="Clear Filter"
                  />
                )}
              </div>
            </div>
          </header>

          <div className="p-3 md:max-h-[calc(100vh-200px)] overflow-y-auto">
            {!mvpsData ? (
              <Loader />
            ) : playerMVPs?.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">
                  {selectedPlayer ? "No mvps recorded" : "No mvps found"}
                </p>
                <DIALOG
                  trigger={
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Record a mvp
                    </>
                  }
                  variant={"outline"}
                >
                  <MVPForm player={selectedPlayer as IPlayer} />
                </DIALOG>
              </div>
            ) : (
              <div className="space-y-4">
                {playerMVPs?.map((mvp) => (
                  <MvpCard
                    mvp={mvp}
                    key={mvp._id}
                    selectedPlayer={selectedPlayer as IPlayer}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
