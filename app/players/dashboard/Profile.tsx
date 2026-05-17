"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerHeader } from "./Header";
import { PlayerInjuryAndIssues } from "./InjuryAndIssues";
import { PerformanceTabs } from "./Performance";
import { PlayerSidebar } from "./Sidebar";
import { StatsCards } from "./Stats";
import { PositionVisualization } from "./PositionVisualization";
import GalleryGrid from "@/components/Gallery/GallaryGrid";
import { PlayerFeatureMedia } from "./FeatureMedia";
import DataErrorAlert from "@/components/error/DataError";
import PageLoader from "@/components/loaders/Page";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useGetPlayerQuery } from "@/services/player.endpoints";
import NotifierWrapper from "@/components/Notifier";
import LoginModal from "@/components/auth/Login";
import { useGetShortUrlQuery } from "@/services/app.endpoints";

export default function PlayerProfile({ slug }: { slug?: string }) {
  const { data: session } = useSession();
  const user = session?.user;
  const {
    data: playerData,
    isLoading,
    error,
  } = useGetPlayerQuery(slug || user?.email || "");
  const player = playerData?.data;

  const isAuthorized =
    user?.email == player?.email || user?.role.includes("admin");

  const { data: shorturl } = useGetShortUrlQuery(
    "https://wa-bunyeni-fc.vercel.app",
  );

  console.log(shorturl);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isLoading && error) {
    return <DataErrorAlert message={error} />;
  }

  return (
    <div className="min-h-screen md:p-8 pt-20 md:pt-6">
      {!isAuthorized && (
        <NotifierWrapper
          className="mb-5 text-primary font-light"
          message={"Only authorized player can edit this content"}
          isDismissible={true}
        >
          <LoginModal variant={"default"} trigger={"Sign in to update page"} />
        </NotifierWrapper>
      )}
      <div className="max-w-7xl mx-auto">
        <PlayerHeader player={player} isAuthorized={isAuthorized} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <PlayerSidebar player={player} isAuthorized={isAuthorized} />
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

            <PlayerFeatureMedia player={player} isAuthorized={isAuthorized} />

            {/* Gallery Section */}
            <div className="pb-4 space-y-3">
              <GalleryGrid tags={[player?._id as string]} galleries={[]} />
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
