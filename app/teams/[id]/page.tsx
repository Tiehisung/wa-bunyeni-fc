// app/teams/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
 
  User,
   
  Trophy,
} from "lucide-react";
import { ENV } from "@/lib/env";
import { baseApiUrl } from "@/lib/configs";
import { formatDate } from "@/lib/timeAndDate";
import { ITeam } from "@/types/match.interface";

interface TeamPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: TeamPageProps): Promise<Metadata> {
  const { id } = await params;
  const team = await getTeamById(id);

  if (!team) {
    return {
      title: `Team Not Found | ${ENV.TEAM_NAME}`,
      description: "The requested team could not be found.",
    };
  }

  return {
    title: `${team?.name} | Teams | ${ENV.TEAM_NAME}`,
    description: `View profile of ${team?.name}. Location: ${team?.community || "N/A"}. Contact: ${team?.contactName || "N/A"}.`,
    openGraph: {
      title: `${team?.name} | ${ENV.TEAM_NAME}`,
      description: `Team profile for ${team?.name}.`,
      images: team?.logo ? [{ url: team?.logo, width: 1200, height: 630 }] : [],
    },
  };
}

// Fetch single team
async function getTeamById(id: string): Promise<ITeam | null> {
  try {
    const response = await fetch(`${`${baseApiUrl}/teams`}/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching team:", error);
    return null;
  }
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { id } = await params;
  const team = await getTeamById(id);

  if (!team) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Link
          href="/teams"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Teams
        </Link>
      </div>

      {/* Team Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl border overflow-hidden">
          <div className="relative h-64 bg-linear-to-r from-primary/20 to-primary/5">
            {team?.logo && (
              <div className="absolute -bottom-12 left-8">
                <div className="bg-background rounded-2xl p-3 shadow-lg">
                  <div className="relative w-32 h-32">
                    <Image
                      src={team?.logo as string}
                      alt={team?.name as string}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-16 pb-8 px-8">
            <h1 className="text-3xl font-bold mb-2">{team?.name}</h1>
            {team?.alias && (
              <p className="text-muted-foreground mb-4">aka "{team?.alias}"</p>
            )}
          </div>
        </div>
      </div>

      {/* Team Details Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Contact Information
              </h2>
              <div className="space-y-3">
                {team?.contactName && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-24">
                      Contact Person:
                    </span>
                    <span className="font-medium">{team?.contactName}</span>
                  </div>
                )}
                {team?.contact && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-24">
                      Phone:
                    </span>
                    <span className="font-medium">{team?.contact}</span>
                  </div>
                )}
                {team?.community && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-24">
                      Location:
                    </span>
                    <span className="font-medium">{team?.community}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Team Stats (if available) */}
            <div className="bg-card rounded-xl border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Match History
              </h2>
              <div className="text-center py-8 text-muted-foreground">
                <p>Match statistics coming soon.</p>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border p-6">
              <h2 className="text-lg font-semibold mb-4">Team Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Added:</span>
                  <span className="text-sm">
                    {formatDate(team?.createdAt,)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last Updated:
                  </span>
                  <span className="text-sm">
                    {formatDate(team?.updatedAt,)}
                  </span>
                </div>
                {team?.currentPlayers && team?.currentPlayers.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Players:
                    </span>
                    <span className="text-sm">
                      {team?.currentPlayers.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
