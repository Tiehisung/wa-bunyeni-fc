"use client";

import { CountupMetricCard } from "@/components/Metrics/Cards";
import { IQueryResponse } from "@/types";
import { ECardType, ICard } from "@/types/card.interface";
import { AlertCircle, AlertTriangle, AlertOctagon } from "lucide-react";
import { useMemo } from "react";

interface IProps {
  cards?: IQueryResponse<ICard[]> | null;
  loading?: boolean;
}
export function CardsStats({ loading, cards }: IProps) {
  // Get cards statistics
  const cardsStats = useMemo(() => {
    const stats = {
      total: cards?.data?.length ?? 0,
      YELLOW:
        cards?.data?.filter((t) => t.type === ECardType.YELLOW)?.length ?? 0,
      RED: cards?.data?.filter((t) => t.type === ECardType.RED)?.length ?? 0,
    };
    return stats;
  }, [cards]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <CountupMetricCard
        icon={<AlertCircle className="h-6 w-6" />}
        value={cardsStats.total}
        isLoading={loading}
        isCountUp
        description="Total Cards"
        color="gray"
      />

      <CountupMetricCard
        icon={<AlertTriangle className="h-6 w-6" />}
        value={cardsStats?.YELLOW}
        isLoading={loading}
        isCountUp
        description="Yellow"
        color="yellow"
      />
      <CountupMetricCard
        icon={<AlertOctagon className="h-6 w-6" />}
        value={cardsStats.RED}
        isLoading={loading}
        isCountUp
        description="Red"
        color="red"
      />
    </div>
  );
}
