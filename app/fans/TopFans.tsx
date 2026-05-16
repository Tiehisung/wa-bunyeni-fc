"use client";

import { useSession } from "next-auth/react";
import { FanLeaderboard } from "./FanLeaderboard";
import { FanStatsWidget } from "./FanStatsWidget";
import { MyFanProfile } from "./MyFanProfile";

export default function FansClient() {
  const { data: session } = useSession();

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Leaderboard */}
        <div className="lg:col-span-2">
          <FanLeaderboard />
        </div>

        {/* Right Column - User Profile & Stats */}
        <div className="space-y-6">
          {session && <MyFanProfile />}
          <FanStatsWidget />
        </div>
      </div>
    </div>
  );
}
