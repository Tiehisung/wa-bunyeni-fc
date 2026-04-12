"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerHeader } from "./Header";
import { PlayerInjuryAndIssues } from "./InjuryAndIssues";
import { PerformanceTabs } from "./Performance";
import { PlayerSidebar } from "./Sidebar";
import { StatsCards } from "./Stats";
import { PositionVisualization } from "./PositionVisualization";
import { IGallery } from "@/types/file.interface";
import GalleryGrid from "@/components/Gallery/GallaryGrid";
 
import { PlayerFeatureMedia } from "./FeatureMedia";
import { useGetPlayerQuery } from "@/services/player.endpoints";
import { TEAM } from "@/data/team";
import { useGetGalleriesQuery } from "@/services/gallery.endpoints";
import { useAppSelector } from "@/store/hooks/store";
import DataErrorAlert from "@/components/error/DataError";
  import PageLoader from "@/components/loaders/Page";
import Link from "next/link";

export default function PlayerDashboardPage() {
  const { user } = useAppSelector((s) => s.auth);

  const {
    data: playerData,
    isLoading: playerLoading,
    error: playerError,
    isFetching,
    refetch,
  } = useGetPlayerQuery(user?.email || "");

  const { data: galleriesData, isLoading: galleriesLoading } =
    useGetGalleriesQuery(`tags=${playerData?.data?._id}&limit=3`, {
      skip: !playerData?.data?._id,
    });

  const isLoading = playerLoading || galleriesLoading;
  const player = playerData?.data;
  const galleries = galleriesData;

  if (isLoading) {
    return <PageLoader />;
  }

  if (playerError || !player) {
    return (
      <DataErrorAlert
        message={playerError}
        onRefetch={refetch}
        isRefreshing={isFetching}
      />
    );
  }
 
  return (
   <div className="min-h-screen bg-accent p-4 md:p-8 pt-20 md:pt-20">
        <div className="max-w-7xl mx-auto">
          <PlayerHeader player={player} />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <PlayerSidebar player={player} />
              <PositionVisualization player={player} />
            </div>

            {/* Main content */}
            <div className="lg:col-span-3 space-y-8">
              <StatsCards player={player} />

              <PlayerInjuryAndIssues player={player} />

              <PerformanceTabs player={player} />

              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About Player</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html: player?.about || "No description available.",
                    }}
                  />
                </CardContent>
              </Card>

              <PlayerFeatureMedia player={player} />

              {/* Gallery Section */}
              <div className="pb-4 space-y-3">
                <GalleryGrid galleries={galleries?.data as IGallery[]} />
                <Link
                  href={`/players/dashboard/galleries?playerId=${player?._id}`}
                  className="pl-4"
                >
                  More Galleries
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
