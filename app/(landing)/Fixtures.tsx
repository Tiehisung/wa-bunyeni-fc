"use client";

import Loader from "@/components/loaders/Loader";
import { useGetMatchesQuery } from "@/services/match.endpoints";
import React from "react";
import ModernFixtureCard from "../matches/(fixturesAndResults)/cards/Modern";
import Link from "next/link";

const LandingFixtures: React.FC = () => {
  const { data: matchesData, isLoading } = useGetMatchesQuery({});

  if (isLoading) {
    return <Loader message="Loading fixtures..." />;
  }

  return (
    <section id="fixtures" className="py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold tracking-wide uppercase text-sm">
            Calendar
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4 ">
            Fixtures & Results
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        <div className="max-w-4xl mx-auto space-y-4">
          {matchesData?.data?.map((match, index) => {
            return <ModernFixtureCard key={index} match={match} />;
          })}
        </div>

        <br />

        <div className="text-center mt-10">
          <Link
            href="/matches"
            className="text-primary hover:text-primary/80 font-semibold inline-flex items-center gap-1"
          >
            View Full Schedule <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingFixtures;
