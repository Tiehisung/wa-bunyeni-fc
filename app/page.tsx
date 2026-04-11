"use client";

import { useAuth } from "@/store/hooks/useAuth";
import About from "./(landing)/About";
import LandingFixtures from "./(landing)/Fixtures";
import LandingNewsHeadlines from "./(landing)/LandingNews";
import NEWSSECTION from "./(landing)/LandingNewsSection";
import LandingPlayers from "./(landing)/LandingPlayers";
import LandingMatchSquad from "./(landing)/LandingSquad";
import Newsletter from "./(landing)/Newsletter";
import Contact from "./contact/Contact";

const LandingPage = () => {
  const session = useAuth();

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
