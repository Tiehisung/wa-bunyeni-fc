import { TEAM } from "@/data/team";
import JoinUs from "./JoinUsClient";

export const metadata = {
  title: "Join Us",
  description: "Join Konjiehi FC.",
  keywords: [
    "Konjiehi FC join us",
    "Konjiehifc fans",
    "konjihifc players",
    "Join Konjiehifc",
  ],
  openGraph: {
    title: "Join Konjiehi FC ",
    description:
      "Meet the official players, fans and supporters of Konjiehi FC.",
    images: [TEAM.logo],
  },
};

const JoinUsPage = () => {
  return (
    <div className="relative grow w-full -mt-40">
      <JoinUs />
    </div>
  );
};

export default JoinUsPage;
