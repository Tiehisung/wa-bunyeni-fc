// components/admin/TrendingUpdateCard.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, RefreshCw, Clock, Trophy } from "lucide-react";
import { toast } from "sonner";

export function TrendingNewsUpdateCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [trendingCount, setTrendingCount] = useState<number | null>(null);

  // Fetch current trending status on load
  useEffect(() => {
    fetchTrendingStats();
  }, []);

  const fetchTrendingStats = async () => {
    try {
      const response = await fetch("/api/news/trending/stats");
      const data = await response.json();
      if (data.success) {
        setTrendingCount(data.count);
        if (data.lastUpdated) {
          setLastUpdated(new Date(data.lastUpdated));
        }
      }
    } catch (error) {
      console.error("Failed to fetch trending stats:", error);
    }
  };

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
        setTrendingCount(data.count);
        toast.success(data.message || "Trending scores updated!");
        // Refresh the page data
        window.dispatchEvent(new CustomEvent("trending-updated"));
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch (error) {
      toast.error("Failed to update trending scores");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          Trending Score Update
        </CardTitle>
        <CardDescription>
          Manually recalculate trending scores based on views, likes, comments,
          and shares
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-muted-foreground">Trending items:</span>
          </div>
          <Badge variant="secondary">
            {trendingCount !== null ? trendingCount : "—"}
          </Badge>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Last updated:</span>
          </div>
          <span className="font-mono text-xs">
            {lastUpdated ? lastUpdated.toLocaleString() : "Never"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-3">
        <Button
          onClick={fetchTrendingStats}
          variant="ghost"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>

        <Button
          onClick={handleTriggerUpdate}
          disabled={isLoading}
          size="sm"
          className="gap-2"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Updating...
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4" />
              Update Now
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
