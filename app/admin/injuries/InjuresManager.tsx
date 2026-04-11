"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Filter, AlertTriangle, Plus } from "lucide-react";
import { IPlayer } from "@/types/player.interface";
import { EInjurySeverity, IInjury } from "@/types/injury.interface";
import { ClearBtn } from "@/components/buttons/ClearFilters";
import SELECT from "@/components/select/Select";
import { enumToOptions } from "@/lib/select";
import { InjuryStats } from "./Stats";
import { PlayerDisplayPanel } from "../players/PlayerDisplay";
import { InjuryForm } from "./InjuryForm";
import { DIALOG } from "@/components/Dialog";
import { InjuryCard } from "./InjuryCard";
import Loader from "@/components/loaders/Loader";
import { SlicePagination } from "@/components/pagination/SlicePagination";
import { useGetInjuriesQuery } from "@/services/injuries.endpoints";

export function InjuriesManager() {
  const [selectedPlayer, setSelectedPlayer] = useState<IPlayer | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const { data: allInjuries, isLoading } = useGetInjuriesQuery("");

  // Get injuries for selected player or all injuries
  const playerInjuries = useMemo(() => {
    let injuries = selectedPlayer
      ? allInjuries?.data?.filter(
          (injury) => injury.player._id === selectedPlayer._id,
        )
      : allInjuries?.data;

    // Apply severity filter
    if (severityFilter !== "all") {
      injuries = injuries?.filter(
        (injury) => injury.severity === severityFilter,
      );
    }

    // Sort by date (newest first)
    return [...(injuries || [])]?.sort(
      (a, b) =>
        new Date(b?.createdAt as string).getTime() -
        new Date(a?.createdAt as string).getTime(),
    );
  }, [allInjuries, selectedPlayer, severityFilter]);

  const [inview, setInview] = useState<IInjury[]>([]);

  const updateData = (data: IInjury[]) => setInview(data);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div />

        <DIALOG
          trigger={
            <>
              <Plus className="h-4 w-4 mr-2" />
              New Injury Report
            </>
          }
          variant={"default"}
        >
          <InjuryForm match={undefined} injury={undefined} />
        </DIALOG>
      </div>
      <InjuryStats injuries={allInjuries} loading={isLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Player List */}
        <PlayerDisplayPanel onSelect={(p) => setSelectedPlayer(p as IPlayer)} />
        {/* Right Panel: Injuries */}
        <Card className="lg:col-span-2">
          <div className="p-4 border-b">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {selectedPlayer
                    ? `Injuries - ${selectedPlayer.firstName} ${selectedPlayer.lastName}`
                    : "All Injuries"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {playerInjuries?.length}
                  {playerInjuries?.length !== 1 ? " injuries" : " injury"} found
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm">
                  <Filter className="h-4 w-4" />
                  <span>Filter:</span>
                </div>

                <SELECT
                  options={enumToOptions(EInjurySeverity)}
                  placeholder="Severity"
                  value={severityFilter}
                  onChange={(v) => setSeverityFilter(v)}
                />

                {selectedPlayer && (
                  <ClearBtn
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPlayer(null)}
                    label=""
                  />
                )}
              </div>
            </div>
          </div>

          <div className="p-4 md:max-h-[calc(100vh-300px)] overflow-y-auto">
            {isLoading ? (
              <Loader message="Loading injuries ..." />
            ) : playerInjuries?.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">
                  {selectedPlayer
                    ? "No injuries recorded for this player"
                    : "No injuries found"}
                </p>
                <DIALOG
                  trigger={
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Report First Injury
                    </>
                  }
                  variant={"outline"}
                >
                  <InjuryForm player={selectedPlayer as IPlayer} />
                </DIALOG>
              </div>
            ) : (
              <div className="space-y-4">
                {inview?.map((injury) => (
                  <InjuryCard
                    key={injury._id}
                    injury={injury}
                    selectedPlayer={selectedPlayer as IPlayer}
                  />
                ))}

                <SlicePagination
                  data={playerInjuries}
                  onPageChange={updateData}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
