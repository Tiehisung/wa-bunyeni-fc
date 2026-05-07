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
import { auth } from "@/auth";
import { getPlayer } from "../[slug]/page";

export default async function PlayerDashboardPage() {
  const session = await auth();
  const user = session?.user;

  const player = await getPlayer(user?.email || "");

  console.log("Fetched player data:", player);

  if (!player) {
    return <PageLoader />;
  }

  if (player?.success && player?.message) {
    return <DataErrorAlert message={player?.message} />;
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
              <GalleryGrid
                tags={[player?.data?._id as string]}
                galleries={[]}
              />
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
