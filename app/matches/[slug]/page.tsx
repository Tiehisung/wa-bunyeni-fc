// app/matches/[slug]/page.tsx
import { Metadata } from "next";
import { ENV } from "@/lib/env";
import { formatDate } from "@/lib/timeAndDate";
import { getMatch } from "../page";
import MatchDetailsClient from "./Client";
import { checkMatchMetrics } from "@/lib/compute/match";
import { IMatch } from "@/types/match.interface";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const matchData = await getMatch(slug);
  const match = matchData?.data as IMatch;

  console.log({ slug, match });
  if (!match) {
    return {
      title: `Match Not Found | ${ENV.TEAM_NAME}`,
      description: "The requested match could not be found.",
    };
  }
  const { teams, winStatus } = checkMatchMetrics(match);
  const homeTeam = teams.home;
  const awayTeam = teams.away;
  const scoreText =
    match.status === "FT"
      ? `${match.computed?.teamScore} - ${match.computed?.opponentScore}`
      : "vs";
  const resultEmoji =
    winStatus === "win" ? "✅" : winStatus === "loss" ? "❌" : "🤝";

  const title = `${homeTeam?.name} ${scoreText} ${awayTeam?.name} | ${ENV.TEAM_NAME}`;
  const description = `${ENV.TEAM_NAME} ${match.isHome ? "host" : "visit"} ${match.opponent?.name} on ${formatDate(match.date)}. ${match.computed?.result ? `${resultEmoji} Result: ${match.computed?.result.toUpperCase()}. ` : ""}Score: ${match.computed?.teamScore || 0} - ${match.computed?.opponentScore || 0}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${ENV.APP_URL}/matches/${slug}`,
      siteName: ENV.TEAM_NAME,
      type: "article",
      publishedTime: match.date,
      images: [
        {
          url: (match.opponent?.logo || ENV.LOGO_URL) as string,
          width: 1200,
          height: 630,
          alt: `${homeTeam} vs ${awayTeam}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [(match.opponent?.logo || ENV.LOGO_URL) as string],
    },
  };
}

// Match Details Page Component
export default async function MatchDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <MatchDetailsClient slug={slug} />
    </main>
  );
}
