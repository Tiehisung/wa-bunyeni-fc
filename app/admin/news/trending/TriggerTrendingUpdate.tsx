"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUpdateTrendingNewsMutation } from "@/services/news.endpoints";
import { smartToast } from "@/utils/toast";

export function TriggerTrendingNewsUpdate() {
  const [updateTrends, { isLoading }] = useUpdateTrendingNewsMutation();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleTriggerUpdate = async () => {
    try {
      const result = await updateTrends().unwrap();
      smartToast(result);
      setLastUpdated(new Date());
    } catch (error) {
      toast.error("Failed to update trending scores");
    } finally {
    }
  };
  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={handleTriggerUpdate}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <TrendingUp className="h-4 w-4" />
        )}
        {isLoading ? "Updating..." : "Update Trending"}
      </Button>

      {lastUpdated && (
        <span className="text-xs text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
