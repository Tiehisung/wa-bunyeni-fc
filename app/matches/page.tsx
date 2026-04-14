import FixturesSection from "./Fixtures";
import HEADER from "@/components/Element";
import { Metadata } from "next";
import { ENV } from "@/lib/env";

export const metadata: Metadata = {
  title: `Matches & Fixtures | ${ENV.TEAM_NAME}`,
  description: `View ${ENV.TEAM_NAME} upcoming fixtures, live scores, and match results. Stay updated with all match schedules, venues, and outcomes. Follow your team throughout the season.`,
  keywords: [
    `${ENV.TEAM_NAME} matches`,
    "fixtures",
    "results",
    "live scores",
    "match schedule",
    "football fixtures",
  ],
  openGraph: {
    title: `Matches & Fixtures | ${ENV.TEAM_NAME}`,
    description: `View upcoming fixtures, live scores, and match results for ${ENV.TEAM_NAME}.`,
    url: `${ENV.APP_URL}/matches`,
    siteName: ENV.TEAM_NAME,
    type: "website",
    images: [
      {
        url: `${ENV.APP_URL}/matchday.jpg`,
        width: 1200,
        height: 630,
        alt: `${ENV.TEAM_NAME} Match Day`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Matches & Fixtures | ${ENV.TEAM_NAME}`,
    description: `Upcoming fixtures, live scores, and match results.`,
    images: [`${ENV.APP_URL}/matchday.jpg`],
  },
  alternates: {
    canonical: `${ENV.APP_URL}/matches`,
  },
};

export default function MatchesPage() {
  return (
    <div className="">
      <HEADER title="Scores & Fixtures" />
      <FixturesSection />
    </div>
  );
}
