"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function TriggerTrendingNewsUpdate() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleTriggerUpdate = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/news/trending", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setLastUpdated(new Date());
        toast.success(data.message || "Trending scores updated successfully!", {
          description: `Updated ${data.count || 0} news items`,
        });
      } else {
        toast.error(data.error || "Failed to update trending scores");
      }
    } catch (error) {
      toast.error("Failed to trigger trending update. Please try again.");
    } finally {
      setIsLoading(false);
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
