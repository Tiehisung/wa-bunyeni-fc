// app/teams/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, Trophy, ImageIcon } from "lucide-react";
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
      images:
        team?.images?.[0] || team?.logo
          ? [
              {
                url: team?.images?.[0] || team?.logo || "",
                width: 1200,
                height: 630,
              },
            ]
          : [],
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

  const displayImages = team?.images?.length
    ? team?.images
    : team?.logo
      ? [team?.logo]
      : [];
  const mainImage = displayImages[0];

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

      {/* Team Header with Main Image */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl border overflow-hidden">
          {/* Main Cover Image */}
          <div className="relative h-80 w-full bg-linear-to-r from-primary/20 to-primary/5">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={team?.name as string}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-20 h-20 text-muted-foreground/30" />
              </div>
            )}

            {/* Team Logo Overlay */}
            {team?.logo && team?.logo !== mainImage && (
              <div className="absolute -bottom-12 left-8">
                <div className="bg-background rounded-2xl p-3 shadow-lg">
                  <div className="relative w-24 h-24">
                    <Image
                      src={team?.logo}
                      alt={team?.name}
                      fill
                      className="object-contain"
                      sizes="96px"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Team Name Section */}
          <div
            className={`${team?.logo && team?.logo !== mainImage ? "pt-16" : "pt-8"} pb-8 px-8`}
          >
            <h1 className="text-3xl font-bold mb-2">{team?.name}</h1>
            {team?.alias && (
              <p className="text-muted-foreground">aka "{team?.alias}"</p>
            )}
          </div>
        </div>
      </div>

      {/* Image Gallery Section */}
      {displayImages.length > 1 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Team Gallery ({displayImages.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayImages.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition"
              >
                <Image
                  src={image}
                  alt={`${team?.name} image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}

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
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-muted-foreground w-28">
                      Contact Person:
                    </span>
                    <span className="font-medium">{team?.contactName}</span>
                  </div>
                )}
                {team?.contact && (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-muted-foreground w-28">
                      Phone:
                    </span>
                    <span className="font-medium">{team?.contact}</span>
                  </div>
                )}
                {team?.community && (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-muted-foreground w-28">
                      Location:
                    </span>
                    <span className="font-medium">{team?.community}</span>
                  </div>
                )}
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
                  <span className="text-sm">{formatDate(team?.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last Updated:
                  </span>
                  <span className="text-sm">{formatDate(team?.updatedAt)}</span>
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
                {displayImages.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Photos:
                    </span>
                    <span className="text-sm">{displayImages.length}</span>
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
