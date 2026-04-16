// app/teams/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, User, Users } from "lucide-react";
import { ENV } from "@/lib/env";
import { apiConfig } from "@/lib/configs";
import { formatDate } from "@/lib/timeAndDate";
import { ITeam } from "@/types/match.interface";

interface TeamsPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Metadata for SEO
export const metadata: Metadata = {
  title: `Teams & Opponents | ${ENV.TEAM_NAME}`,
  description: `Meet the teams and opponents of ${ENV.TEAM_NAME}. View team profiles, locations, and match history.`,
  keywords: [
    `${ENV.TEAM_NAME} opponents`,
    "football teams",
    "rivals",
    "match opponents",
  ],
  openGraph: {
    title: `Teams & Opponents | ${ENV.TEAM_NAME}`,
    description: `Meet the teams and opponents of ${ENV.TEAM_NAME}.`,
    url: `${ENV.APP_URL}/teams`,
    siteName: ENV.TEAM_NAME,
    type: "website",
    images: [{ url: `${ENV.LOGO_URL}`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Teams & Opponents | ${ENV.TEAM_NAME}`,
    description: `Meet the teams and opponents of ${ENV.TEAM_NAME}.`,
    images: [`${ENV.APP_URL}`],
  },
};

// Fetch teams from API
async function getTeams(): Promise<ITeam[]> {
  try {
    const response = await fetch(`${apiConfig.teams}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch teams:", response.status);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
}

export default async function TeamsPage({ searchParams }: TeamsPageProps) {
  const teams = await getTeams();

  // Filter out the main team if needed (optional)
  const opponentTeams = teams.filter((team) => team.name !== ENV.TEAM_NAME);

  if (!teams.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">No Teams Found</h1>
          <p className="text-muted-foreground">
            Check back later for team information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Header Section */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Teams & Opponents
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the teams that compete against {ENV.TEAM_NAME}. View team
            profiles, locations, and match history.
          </p>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="container mx-auto px-4 py-12">
        {opponentTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opponentTeams.map((team) => (
              <TeamCard key={team._id} team={team} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">No opponent teams yet</h3>
            <p className="text-muted-foreground">
              Check back later for updates.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

// Team Card Component
function TeamCard({ team }: { team: ITeam }) {
  return (
    <Link href={`/teams/${team._id}`}>
      <div className="group bg-card rounded-xl border hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
        {/* Team Logo/Image */}
        <div className="relative h-48 bg-linear-to-br from-primary/10 to-primary/5 overflow-hidden">
          {team.logo ? (
            <Image
              src={team.logo}
              alt={team.name}
              fill
              className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Users className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Team Info */}
        <div className="p-5">
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {team.name}
          </h3>

          {team.alias && (
            <p className="text-sm text-muted-foreground mb-3">
              aka "{team.alias}"
            </p>
          )}

          <div className="space-y-2 text-sm">
            {team.community && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{team.community}</span>
              </div>
            )}

            {team.contact && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{team.contact}</span>
              </div>
            )}

            {team.contactName && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{team.contactName}</span>
              </div>
            )}
          </div>

          {/* Footer with created date */}
          <div className="mt-4 pt-3 border-t text-xs text-muted-foreground flex justify-between items-center">
            <span>Added {formatDate(team.createdAt,  )}</span>
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
