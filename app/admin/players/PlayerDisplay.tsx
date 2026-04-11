"use client";

import BackBtn from "@/components/buttons/BackBtn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import { IPlayer } from "@/types/player.interface";
import { Search, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
 

interface Props {
  onSearch?: (e: string) => void;
  onSelect: (player?: IPlayer) => void;
  filters?: object;
  defaultPlayers?: IPlayer[];
}
export function PlayerDisplayPanel({
  onSelect,
  onSearch,
  defaultPlayers,
}: Props) {
  const searchParams = useSearchParams();
  const [selectedPlayer, setSelectedPlayer] = useState("");

  // Fetch players using RTK Query
  const { data: playersData, isLoading } = useGetPlayersQuery(
    searchParams.toString(),
  );
  const players = defaultPlayers ?? playersData?.data ?? [];

  // Filter players based on search
  const [searchQuery, setSearchQuery] = useState("");
  const filteredPlayers = useMemo(() => {
    return players?.filter((player) => {
      const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
      const searchLower = searchQuery.toLowerCase();

      return (
        fullName.includes(searchLower) ||
        String(player.number)?.includes(searchQuery) ||
        player.email?.includes(searchQuery) ||
        player.position?.toLowerCase().includes(searchLower)
      );
    });
  }, [players, searchQuery]);

  return (
    <Card className="lg:col-span-1">
      <div className="p-4 border-b">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch?.(e.target.value);
            }}
            className="pl-9"
          />
        </div>

        <div className="flex items-start gap-5">
          {selectedPlayer && (
            <BackBtn
              onClick={() => {
                onSelect?.(undefined);
                setSelectedPlayer("");
              }}
              className=""
            />
          )}

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="all">All Players</TabsTrigger>
              <TabsTrigger value="current">Current</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="p-2 max-h-[calc(100vh-300px)] overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-8">Loading players...</div>
        ) : filteredPlayers?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No players found
          </div>
        ) : (
          <div className="space-y-1">
            {filteredPlayers?.map((player) => {
              return (
                <Button
                  key={player._id}
                  onClick={() => {
                    setSelectedPlayer(player._id);
                    onSelect?.(player);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 h-14 _shrink`}
                  variant={selectedPlayer === player._id ? "default" : "ghost"}
                >
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    {player.avatar ? (
                      <img
                        src={player.avatar}
                        alt={player.firstName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {player.firstName} {player.lastName}
                    </div>
                    <div className="text-sm opacity-75 flex items-center gap-2">
                      <span>#{player.number}</span>
                      <span>•</span>
                      <span className="truncate">{player.position}</span>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
