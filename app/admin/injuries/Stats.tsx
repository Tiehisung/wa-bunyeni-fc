"use client";

import { CountupMetricCard } from "@/components/Metrics/Cards";
import { useGetInjuriesQuery } from "@/services/injuries.endpoints";
import { IQueryResponse } from "@/types";
import { EInjurySeverity, IInjury } from "@/types/injury.interface";
import { AlertCircle, AlertTriangle, AlertOctagon } from "lucide-react";
import { useMemo } from "react";

interface IProps {
  injuries?: IQueryResponse<IInjury[]> | null;
  loading?: boolean;
}
export function InjuryStats({ loading }: IProps) {
  const { data: allInjuries } = useGetInjuriesQuery("");
  // Get injury statistics
  const injuryStats = useMemo(() => {
    const stats = {
      total: allInjuries?.data?.length ?? 0,
      bySeverity: {
        MINOR:
          allInjuries?.data?.filter(
            (inj) => inj.severity === EInjurySeverity.MINOR,
          )?.length ?? 0,
        MODERATE:
          allInjuries?.data?.filter((inj) => inj.severity === "MODERATE")
            ?.length ?? 0,
        MAJOR:
          allInjuries?.data?.filter(
            (inj) => inj.severity === EInjurySeverity.MAJOR,
          )?.length ?? 0,
        SEVERE:
          allInjuries?.data?.filter((inj) => inj.severity === "SEVERE")
            ?.length ?? 0,
      },
      active: allInjuries?.data?.filter((inj) => {
        const injuryDate = new Date(inj?.createdAt as string);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return injuryDate > thirtyDaysAgo;
      }).length,
    };
    return stats;
  }, [allInjuries]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <CountupMetricCard
        icon={<AlertCircle className="h-6 w-6" />}
        value={injuryStats.total}
        isLoading={loading}
        isCountUp
        description="Total Injuries"
        color="gray"
      />
      <CountupMetricCard
        icon={<AlertCircle className="h-6 w-6" />}
        value={injuryStats.bySeverity.MINOR}
        isLoading={loading}
        isCountUp
        description="Minor"
        color="green"
      />
      <CountupMetricCard
        icon={<AlertTriangle className="h-6 w-6" />}
        value={
          injuryStats?.bySeverity?.MODERATE + injuryStats?.bySeverity?.MAJOR
        }
        isLoading={loading}
        isCountUp
        description="Moderate/Major"
        color="orange"
      />
      <CountupMetricCard
        icon={<AlertOctagon className="h-6 w-6" />}
        value={injuryStats.bySeverity.SEVERE}
        isLoading={loading}
        isCountUp
        description="Severe"
        color="red"
      />
    </div>
  );
}
