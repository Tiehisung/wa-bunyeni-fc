import { Metadata } from "next";
import { TEAM } from "@/data/team";
import FansClient from "./TopFans";

export const metadata: Metadata = {
  title: `Top Fans | ${TEAM.name}`,
  description: `Meet the most dedicated ${TEAM.name} fans. See who's leading the fan rankings and engagement scores.`,
  keywords: ["fans", "top fans", "supporters",'fan leaderboard', `${TEAM.name} fans`],
  openGraph: {
    title: `Top Fans - ${TEAM.name}`,
    description: "Celebrating our most passionate supporters.",
  },
};
const FansPage = () => {
  return (
    <div>
      <FansClient />
    </div>
  );
};

export default FansPage;
