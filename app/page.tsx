 
import About from "./(landing)/About";
import LandingFixtures from "./(landing)/Fixtures";
import LandingNewsHeadlines from "./(landing)/LandingNews";
import NEWSSECTION from "./(landing)/LandingNewsSection";
import LandingPlayers from "./(landing)/LandingPlayers";
import LandingMatchSquad from "./(landing)/LandingSquad";
import Newsletter from "./(landing)/Newsletter";
import Contact from "./contact/Contact";
import { Metadata } from "next";
import { ENV } from "@/lib/env";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: `${ENV.TEAM_NAME} - Official Website`,
  description: `Official website of ${ENV.TEAM_NAME}. Get the latest news, match updates, player profiles, fixtures, results, and everything about your favorite team.`,
  keywords: [
    `${ENV.TEAM_NAME}`,
    "football",
    "soccer",
    "Ghana football",
    "club website",
    "live scores",
    "match highlights",
  ],
  openGraph: {
    title: `${ENV.TEAM_NAME} - Official Website`,
    description: `Follow ${ENV.TEAM_NAME} for live scores, match highlights, player stats, and breaking news. Join our passionate fan community!`,
    url: ENV.APP_URL,
    siteName: ENV.TEAM_NAME,
    type: "website",
    images: [
      {
        url: ENV.LOGO_URL as string,
        width: 1200,
        height: 630,
        alt: `${ENV.TEAM_NAME} Logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${ENV.TEAM_NAME} - Official Website`,
    description: `Official website of ${ENV.TEAM_NAME}. News, matches, players, and more.`,
    images: [ENV.LOGO_URL as string],
  },
  alternates: {
    canonical: ENV.APP_URL,
  },
};

const LandingPage = async () => {
  const session = await auth();

  console.log(session);

  return (
    <div className=" relative" id="home">
      <NEWSSECTION />

      <LandingPlayers />

      <LandingNewsHeadlines />

      <LandingMatchSquad />

      {/* <LiveMatchCard /> */}

      <LandingFixtures />

      <Contact />

      <About />

      <Newsletter />

      {/* <TrendingNews /> */}
    </div>
  );
};

export default LandingPage;
