"use client";

import HEADER from "@/components/Element";
import { PrimaryCollapsible } from "@/components/Collapsible";
import { CgPerformance } from "react-icons/cg";
import { MetricsDashboard } from "./MetricsDashboard";

import TopPerformingPlayers from "./players/TopPlayersPerformance";

export default function AdminDashboardPage() {
  return (
    <div className="  ">
      {/* Main Content */}
      <main className="flex-1 ">
        <HEADER
          className=""
          title={"CLUB MANAGEMENT & CONTROL ADMIN"}
          subtitle="Manage your squad, track performance, insights and analysis"
        />

        {/* Dashboard Content */}
        <div className=" space-y-6 ">
          <PrimaryCollapsible
            header={{
              icon: <CgPerformance size={20} />,
              label: <div className="text-xl font-semibold">Key Metrics</div>,
              className: "ring grow",
            }}
            defaultOpen
          >
            <MetricsDashboard />
          </PrimaryCollapsible>

   
          <TopPerformingPlayers />
        </div>
      </main>
    </div>
  );
}
