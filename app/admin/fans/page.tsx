// app/admin/fans/page.tsx
"use client";

import { useState } from "react";
 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Users, Award, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useGetFanStatsQuery, useGetFanLeaderboardQuery } from "@/services/fans.endpoints";
import { AdminFanStats } from "./AdminFanStats";
import { AdminFanTable } from "./AdminFanTable";

export default function AdminFansPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { refetch: refetchStats } = useGetFanStatsQuery();
  const { refetch: refetchLeaderboard } = useGetFanLeaderboardQuery({
    limit: 100,
  });

  const handleRefresh = async () => {
    await Promise.all([refetchStats(), refetchLeaderboard()]);
    setRefreshKey((prev) => prev + 1);
    toast.success("Fan data refreshed");
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            Fan Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage fan profiles, track engagement, and award badges
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Overview */}
      <AdminFanStats key={refreshKey} />

      {/* Tabs */}
      <Tabs defaultValue="leaderboard" className="mt-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="leaderboard" className="gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="all-fans" className="gap-2">
            <Users className="h-4 w-4" />
            All Fans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="mt-6">
          <AdminFanTable sortBy="points" />
        </TabsContent>

        <TabsContent value="all-fans" className="mt-6">
          <AdminFanTable sortBy="points" showAll />
        </TabsContent>
      </Tabs>
    </div>
  );
}
