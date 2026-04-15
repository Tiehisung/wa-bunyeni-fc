"use client";

import PageLoader from "@/components/loaders/Page";
import { SharePage } from "@/components/SocialShare";
import { getInitials } from "@/lib";
import { ENV } from "@/lib/env";
import { useGetSquadsQuery } from "@/services/squad.endpoints";
 

export default function LatestMatchSquadPage() {
  const { data: squadsData, isLoading } = useGetSquadsQuery("");
  const squad = squadsData?.data ? squadsData.data[0] : null;
  if (isLoading) {
    return <PageLoader />;
  }
  return (
    <section id="squad" className="py-24 ">
      {/* <PageSEO page="squad"/> */}
      <div >
        <div className="text-center mb-16">
          <span className="text-primary font-semibold tracking-wide uppercase text-sm">
            The Team
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4 ">
            First Team Squad
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Meet the talented players representing Bunyeni FC with pride and
            passion
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {squad?.players?.map((player, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-border"
            >
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={player.avatar}
                  alt={player.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-primary uppercase font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                  {player?.number || getInitials(player?.position?.split(" "))}
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-xl ">{player.name}</h3>
                <p className="text-primary text-sm mb-1 font-semibold capitalize">
                  {player.position}
                </p>
              </div>
            </div>
          ))}
        </div>
        <SharePage
          label={"Share this squad"}
          className="rounded-full bg-primary/90"
          text={`Meet the talented players representing ${ENV.TEAM_NAME} with pride and passion in this fixture - ${squad?.title}`}
        />
        <div className="text-center mt-12">
          <button className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg">
            View Full Squad →
          </button>
        </div>
      </div>
    </section>
  );
}
