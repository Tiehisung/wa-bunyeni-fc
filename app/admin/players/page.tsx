"use client";

import { EPlayerAgeCategory, IPlayer } from "@/types/player.interface";
import CaptaincyAdm from "./captaincy/Captaincy";
import { PrimarySearch } from "@/components/Search";
import { DisplayAdminPlayers } from "./DisplayPlayers";
import Loader from "@/components/loaders/Loader";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import { useRouter, useSearchParams } from "next/navigation";
import DataErrorAlert from "@/components/error/DataError";
import { H } from "@/components/Element";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { sParamsToObject } from "@/lib/searchParams";
import { Button } from "@/components/buttons/Button";
import { PrintPlayersBtn } from "./Export";
import { PrimarySelect } from "@/components/select/Select";
import { enumToOptions } from "@/lib/select";
import { useMemo } from "react";
import { getAgeFromDOB } from "@/lib/timeAndDate";
import { PrimaryCollapsible } from "@/components/Collapsible";
import { FcStatistics } from "react-icons/fc";

export default function AdminPlayers() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    data: playersData,
    isLoading: playersLoading,
    error: playersError,
  } = useGetPlayersQuery(sParamsToObject(searchParams));

  const isLoading = playersLoading;
  const players = playersData;

  // Calculate player statistics
  const playerStats = useMemo(() => {
    if (!players?.data?.length) return null;

    const allPlayers = players.data as IPlayer[];
    const totalPlayers = allPlayers.length;

    // Count by category
    const categoryCount = {
      [EPlayerAgeCategory.U13]: 0,
      [EPlayerAgeCategory.U15]: 0,
      [EPlayerAgeCategory.U17]: 0,
      [EPlayerAgeCategory.U20]: 0,
      [EPlayerAgeCategory.SENIOR]: 0,
    };

    // Count by position
    const positionCount: Record<string, number> = {};

    // Count by status
    const statusCount: Record<string, number> = {};

    // Count by availability
    const availabilityCount: Record<string, number> = {};

    // Age statistics
    let youngestAge = Infinity;
    let oldestAge = -Infinity;
    let totalAge = 0;

    allPlayers.forEach((player) => {
      // Category count
      const age = player.age || getAgeFromDOB(player.dob);

      if (age <= 13) categoryCount[EPlayerAgeCategory.U13]++;
      else if (age <= 15) categoryCount[EPlayerAgeCategory.U15]++;
      else if (age <= 17) categoryCount[EPlayerAgeCategory.U17]++;
      else if (age <= 20) categoryCount[EPlayerAgeCategory.U20]++;
      else categoryCount[EPlayerAgeCategory.SENIOR]++;

      // Position count
      if (player.position) {
        positionCount[player.position] =
          (positionCount[player.position] || 0) + 1;
      }

      // Status count
      if (player.status) {
        statusCount[player.status] = (statusCount[player.status] || 0) + 1;
      }

      // Availability count
      if (player.availability) {
        availabilityCount[player.availability] =
          (availabilityCount[player.availability] || 0) + 1;
      }

      // Age stats
      if (age < youngestAge) youngestAge = age;
      if (age > oldestAge) oldestAge = age;
      totalAge += age;
    });

    return {
      totalPlayers,
      averageAge: Math.round(totalAge / totalPlayers),
      youngestAge,
      oldestAge,
      categoryCount,
      positionCount,
      statusCount,
      availabilityCount,
    };
  }, [players?.data]);

  if (isLoading) {
    return (
      <div className="py-12 px-2.5 md:px-6 space-y-8 ">
        <div className="flex justify-center items-center min-h-100">
          <Loader message="Loading players..." />
        </div>
      </div>
    );
  }

  if (playersError) {
    return <DataErrorAlert message={playersError} />;
  }

  return (
    <div className="py-5 px-2.5 md:px-6 space-y-8 ">
      <header className="mb-6 mx-auto">
        <H> PLAYERS</H>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
          <Button
            onClick={() => router.push("/admin/players/new")}
            className="flex items-center gap-2 border hover:ring rounded px-2 py-1 w-max mt-4"
          >
            Add Player
            <Plus />
          </Button>
          <PrintPlayersBtn players={players?.data as IPlayer[]} />
        </div>

        <div className="mt-4 mb-2 flex flex-wrap items-center justify-center gap-6">
          <PrimarySearch
            className=" max-w-[80vw] grow"
            placeholder="Search Player"
            type="search"
            name="search"
            searchKey="player_search"
          />
          <PrimarySelect
            options={enumToOptions(EPlayerAgeCategory)}
            paramKey="category"
            placeholder="Age"
          />
        </div>
      </header>

      {/* Player Statistics Summary */}
      {playerStats && (
        <PrimaryCollapsible
          header={{
            icon: <FcStatistics size={20} />,
            label: (
              <div className="text-xl font-semibold">Player Statistics</div>
            ),
            className: " grow",
          }}
          defaultOpen
          className="border"
        >
          <section className=" rounded-xl p-4 ">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-primary/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">{playerStats.totalPlayers}</p>
                <p className="text-xs text-muted-foreground">Total Players</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">{playerStats.averageAge}</p>
                <p className="text-xs text-muted-foreground">Avg Age (years)</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">{playerStats.youngestAge}</p>
                <p className="text-xs text-muted-foreground">Youngest</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/20 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">{playerStats.oldestAge}</p>
                <p className="text-xs text-muted-foreground">Oldest</p>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
              {Object.entries(playerStats.categoryCount).map(
                ([category, count]) =>
                  count > 0 && (
                    <div
                      key={category}
                      className="flex justify-between items-center bg-muted rounded-lg px-3 py-2"
                    >
                      <span className="text-sm font-medium uppercase">
                        {category}
                      </span>
                      <span className="text-sm font-bold">{count}</span>
                    </div>
                  ),
              )}
            </div>

            {/* Position Distribution */}
            {Object.keys(playerStats.positionCount).length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-2">By Position</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(playerStats.positionCount).map(
                    ([position, count]) => (
                      <span
                        key={position}
                        className="inline-flex items-center gap-1 bg-secondary rounded-full px-2.5 py-0.5 text-xs"
                      >
                        {position}: <strong>{count}</strong>
                      </span>
                    ),
                  )}
                </div>
              </div>
            )}
          </section>{" "}
        </PrimaryCollapsible>
      )}

      <Separator />

      <section className="min-h-screen rounded-2xl">
        <DisplayAdminPlayers players={players} />
      </section>

      <section className="mt-12">
        <CaptaincyAdm players={players?.data as IPlayer[]} />
      </section>
    </div>
  );
}
